package com.example.backend.repository;
import org.springframework.data.domain.Pageable;

import com.example.backend.model.Order;
import com.example.backend.model.OrderDetail;
import com.example.backend.model.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    
    // Find all details for a specific order
    List<OrderDetail> findByOrder(Order order);
    
    // Find all order details for a specific product
    List<OrderDetail> findByProduct(Product product);
    
    // Find non-trashed order details
    List<OrderDetail> findByTrashFalse();
    
    // Find order details for an order that are not in trash
    List<OrderDetail> findByOrderAndTrashFalse(Order order);
    
    // Get total quantity of a product that has been ordered
    @Query("SELECT SUM(od.quantity) FROM OrderDetail od WHERE od.product.id = :productId AND od.trash = false")
    Integer getTotalQuantitySoldByProductId(@Param("productId") Long productId);
    
    // Find best selling products
    @Query("SELECT od.product.id, SUM(od.quantity) as totalSold " +
           "FROM OrderDetail od " +
           "WHERE od.trash = false " +
           "GROUP BY od.product.id " +
           "ORDER BY totalSold DESC")
    List<Object[]> findBestSellingProducts(Pageable pageable);
    
    // Find products in a specific order
    @Query("SELECT od.product FROM OrderDetail od WHERE od.order.id = :orderId AND od.trash = false")
    List<Product> findProductsByOrderId(@Param("orderId") Long orderId);
}