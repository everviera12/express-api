const request = require('supertest');
const app = require('../server');

// 1. Importar el servicio y las funciones de mock
jest.mock('../services/providers.services');
const { getProvidersService, getProviderIdService } = require('../services/providers.services');

const mockProviders = [
    {
        id: 1,
        first_name: 'Dr. House',
        last_name: 'Gregory',
        phone: '555-1234',
        specialty: 'Medicina',
        professional_license: 'A1234',
        languages: ['English', 'Spanish'],
        locality: 'Princeton',
        nationality: 'USA',
        state: 'NJ',
        municipality: 'Princeton'
    },
    {
        id: 2,
        first_name: 'Dr. Grey',
        last_name: 'Meredith',
        phone: '555-5678',
        specialty: 'Cirugía',
        professional_license: 'B5678',
        languages: ['English'],
        locality: 'Seattle',
        nationality: 'USA',
        state: 'WA',
        municipality: 'Seattle'
    },
];

describe('Providers API Routes', () => {

    // Limpia los mocks después de cada test para asegurar el aislamiento
    afterEach(() => {
        jest.clearAllMocks();
    });

    // --- GET /api/v1/providers (Lista) ---
    describe('GET /api/v1/providers', () => {
        

        it('Debe devolver el status 200 y una lista de proveedores', async () => {
            // Configuración del mock para el caso de ÉXITO
            getProvidersService.mockResolvedValue({
                data: mockProviders,
                count: mockProviders.length,
                error: null,
            });

            const response = await request(app).get('/api/v1/providers');

            // ASERSIONES DEL TEST DE ÉXITO (200)
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.meta.data).toHaveLength(2);
            expect(getProvidersService).toHaveBeenCalled();
        });

        // Test que ya pasó: VAlidación del Controller
        it('Debe devolver un status 400 por paginación inválida (limit negativo)', async () => {
            const response = await request(app).get('/api/v1/providers?limit=-5');
            expect(response.statusCode).toBe(400);
            // El servicio NO debe ser llamado si falla la validación
            expect(getProvidersService).not.toHaveBeenCalled();
        });

        it('Debe devolver un status 404 si no hay datos', async () => {
            // Configuración del mock para el caso de NO ENCONTRADO
            getProvidersService.mockResolvedValue({
                data: [],
                count: 0,
                error: null,
            });

            const response = await request(app).get('/api/v1/providers');
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('No providers found');
        });
    });

    // --- GET /api/v1/providers/:id (Individual) ---
    describe('GET /api/v1/providers/:id', () => {

        it('Debe devolver el status 200 y un proveedor por ID', async () => {
            // Configuración del mock para el caso de ÉXITO por ID
            getProviderIdService.mockResolvedValue({
                data: { id: 5, first_name: 'Test ID Provider' },
                error: null,
            });

            const response = await request(app).get('/api/v1/providers/5');

            // ASERSIONES DEL TEST DE ÉXITO (200)
            expect(response.statusCode).toBe(200);
            expect(response.body.data.id).toBe(5);
            expect(getProviderIdService).toHaveBeenCalledWith(5);
        });

        it('Debe devolver el status 404 si el proveedor no existe', async () => {
            // Configuración del mock para el caso de NO ENCONTRADO
            getProviderIdService.mockResolvedValue({
                data: null, // <-- El controller busca 'if (!data)'
                error: null,
            });

            const response = await request(app).get('/api/v1/providers/999');

            // ASERSIONES DEL TEST DE NO ENCONTRADO (404)
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Provider not found');
        });

        // Test que ya pasó: Validación del Controller
        it('Debe devolver status 400 si el ID no es numérico', async () => {
            const response = await request(app).get('/api/v1/providers/abc');
            expect(response.statusCode).toBe(400);
        });
    });

    // --- GET /ping (Ruta simple) ---
    describe('GET /ping', () => {
        it('Debe devolver el status 200 y ok: true', async () => {
            const response = await request(app).get('/ping');
            expect(response.statusCode).toBe(200);
        });
    });
});