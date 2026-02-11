import Product from '../../../src/entities/Product';
import { GetProductController } from '../../../src/controllers/GetProductController';
import type { GetProductUsecase } from '../../../src/usecases/GetProductUsecase';
import type { GetProductUsecaseInterface } from '../../../src/usecases/GetProductUsecase';

describe('GetProductController', () => {

    // Caminho feliz: produto encontrado com sucesso
    test('should return 200 if the product is found successfully', async () => {

        // ARRANGE (preparação)
        // Mock do usecase
        class GetProductUsecaseMock implements GetProductUsecaseInterface {
            execute(barcode: string): Product | Error {
                return Product.rebuild(barcode, 'Test Product', 50, 10);
            }
        }

        const getProductUsecase = new GetProductUsecaseMock();
        const getProductController = new GetProductController(getProductUsecase as GetProductUsecase);

        // Mock da requisição
        const requestMock: any = {
            body: {
                barcode: '123456'
            }
        };

        // Mock da resposta (simulando Express)
        const responseMock: any = {
            statusCode: 0,
            data: null,
            status(code: number) {
                this.statusCode = code;
                return this;
            },
            send(data: any) {
                this.data = data;
                return this;
            }
        };

        // ACT (execução da ação)
        await getProductController.handle(requestMock, responseMock);

        // ASSERT (verificações)
        expect(responseMock.statusCode).toBe(200);

        expect(responseMock.data).toEqual({
            barcode: '123456',
            name: 'Test Product',
            quantityInStock: 50,
            orderReferenceDays: 10
        });
    });

    // Caminho triste: produto não encontrado (usecase retorna um Error)
    test('should return 400 if the usecase returns an ERROR', async () => {

        // ARRANGE (preparação)
        class GetProductUsecaseMock implements GetProductUsecaseInterface {
            execute(barcode: string): Product | Error {
                return new Error('Product not found');
            }
        }

        const getProductUsecase = new GetProductUsecaseMock();
        const getProductController = new GetProductController(getProductUsecase as GetProductUsecase);

        // Mock da requisição
        const requestMock: any = {
            body: {
                barcode: '999999'
            }
        };

        // Mock da resposta (simulando Express)
        const responseMock: any = {
            statusCode: 0,
            data: null,
            status(code: number) {
                this.statusCode = code;
                return this;
            },
            send(data: any) {
                this.data = data;
                return this;
            }
        };

        // ACT (execução da ação)
        await getProductController.handle(requestMock, responseMock);

        // ASSERT (verificações)
        expect(responseMock.statusCode).toBe(400);
        expect(responseMock.data).toEqual({
            message: 'Product not found'
        });
    });    
});