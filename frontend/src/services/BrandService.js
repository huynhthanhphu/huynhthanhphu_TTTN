import httpAxios from "./httpAxios";

const BrandService = {
        index: async () => await httpAxios.get("brands"),
        
        create: async (data) => {
            return await httpAxios.post(`brands`, data);
        },
        
        update: async (id, data) => {
            return await httpAxios.put(`brands/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        },
        
        detail: async (id) => {
            return await httpAxios.get(`brands/${id}`);
        },
        
        status: async (id) => {
            return await httpAxios.put(`brands/status/${id}`, { status: true });
        },
        
        delete: async (id) => {
            return await httpAxios.delete(`brands/${id}`);
        },
        
        moveToTrash: async (id) => {
            return await httpAxios.put(`brands/trash/${id}`);
        },
        
        restoreFromTrash: async (id) => {
            return await httpAxios.put(`brands/restore/${id}`);
        },
        
        getTrash: async () => {
            return await httpAxios.get(`brands/trash`);
        },
        
        emptyTrash: async () => {
            return await httpAxios.delete(`brands/trash/empty`);
        }
};

export default BrandService;