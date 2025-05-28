package com.example.backend.service;

import com.example.backend.dto.OrderDetailDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Order;
import com.example.backend.model.OrderDetail;
import com.example.backend.model.Product;
import com.example.backend.repository.OrderDetailRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderDetailService {
    
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    /**
     * Get order details by order ID
     */
    public List<OrderDetailDTO> getOrderDetailsByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderAndTrashFalse(order);
        return orderDetails.stream()
                .map(OrderDetailDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get an order detail by ID
     */
    public OrderDetailDTO getOrderDetailById(Long id) {
        OrderDetail orderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found with id: " + id));
        return new OrderDetailDTO(orderDetail);
    }
    
    /**
     * Update order detail quantity
     */
    @Transactional
    public OrderDetailDTO updateOrderDetailQuantity(Long orderDetailId, Integer quantity) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found with id: " + orderDetailId));
        
        // Check if order is still pending
        if (!"PENDING".equals(orderDetail.getOrder().getOrderStatus())) {
            throw new IllegalStateException("Cannot modify order that is not in PENDING status");
        }
        
        // Update quantity and recalculate prices
        orderDetail.setQuantity(quantity);
        
        // Update the order's total amount
        Order order = orderDetail.getOrder();
        BigDecimal newTotalAmount = BigDecimal.ZERO;
        for (OrderDetail detail : order.getOrderDetails()) {
            newTotalAmount = newTotalAmount.add(detail.getFinalPrice());
        }
        order.setTotalAmount(newTotalAmount);
        
        // Save both the detail and the order
        orderRepository.save(order);
        OrderDetail updatedDetail = orderDetailRepository.save(orderDetail);
        
        return new OrderDetailDTO(updatedDetail);
    }
    
    /**
     * Remove an item from an order
     */
    @Transactional
    public void removeOrderDetail(Long orderDetailId) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found with id: " + orderDetailId));
        
        // Check if order is still pending
        if (!"PENDING".equals(orderDetail.getOrder().getOrderStatus())) {
            throw new IllegalStateException("Cannot modify order that is not in PENDING status");
        }
        
        Order order = orderDetail.getOrder();
        
        // Remove the detail from the order
        order.removeOrderDetail(orderDetail);
        
        // Recalculate the total amount
        BigDecimal newTotalAmount = BigDecimal.ZERO;
        for (OrderDetail detail : order.getOrderDetails()) {
            newTotalAmount = newTotalAmount.add(detail.getFinalPrice());
        }
        order.setTotalAmount(newTotalAmount);
        
        // Save the order and delete the detail
        orderRepository.save(order);
        orderDetailRepository.delete(orderDetail);
    }
    
    /**
     * Add a new item to an existing order
     */
    @Transactional
    public OrderDetailDTO addItemToOrder(Long orderId, Long productId, Integer quantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        // Check if order is still pending
        if (!"PENDING".equals(order.getOrderStatus())) {
            throw new IllegalStateException("Cannot modify order that is not in PENDING status");
        }
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        
        // Create new order detail
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        orderDetail.setProduct(product);
        orderDetail.setQuantity(quantity);
        BigDecimal unitPrice = BigDecimal.valueOf(product.getPrice());
        BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        orderDetail.setUnitPrice(unitPrice);
        orderDetail.setSubtotal(subtotal);        
        orderDetail.setDiscountAmount(BigDecimal.ZERO); // Apply discounts if needed
        orderDetail.setFinalPrice(orderDetail.getSubtotal().subtract(orderDetail.getDiscountAmount()));
        
        // Add to order and update total
        order.addOrderDetail(orderDetail);
        BigDecimal newTotalAmount = order.getTotalAmount().add(orderDetail.getFinalPrice());
        order.setTotalAmount(newTotalAmount);
        
        // Save both entities
        orderRepository.save(order);
        OrderDetail savedDetail = orderDetailRepository.save(orderDetail);
        
        return new OrderDetailDTO(savedDetail);
    }
    
    /**
     * Get best selling products
     */
    public List<Map<String, Object>> getBestSellingProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> results = orderDetailRepository.findBestSellingProducts(pageable);
        
        return results.stream().map(result -> {
            Long productId = (Long) result[0];
            Long totalSold = (Long) result[1];
            
            Product product = productRepository.findById(productId)
                    .orElse(null);
            
            Map<String, Object> productData = new HashMap<>();
            productData.put("productId", productId);
            productData.put("totalSold", totalSold);
            
            if (product != null) {
                productData.put("productName", product.getName());
                productData.put("productImage", product.getImage());
                productData.put("price", product.getPrice());
            }
            
            return productData;
        }).collect(Collectors.toList());
    }
    
    /**
     * Get total quantity sold for a product
     */
    public Integer getTotalQuantitySoldByProductId(Long productId) {
        Integer totalSold = orderDetailRepository.getTotalQuantitySoldByProductId(productId);
        return totalSold != null ? totalSold : 0;
    }
}