package com.ks.service.ks.controllers;

import com.ks.service.ks.model.Category;
import com.ks.service.ks.model.Product;
import com.ks.service.ks.repository.ProductRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest
@WithMockUser(roles = "ADMIN")
class ProductControllerTest {
    @Autowired
    ProductController productController;

    @MockBean
    ProductRepository productRepository;

    List<Product> mockProducts;

    @BeforeEach
    void setUp() {
        mockProducts = Arrays.asList(
                        new Product()
                        .setProductId(1L)
                        .setName("Water")
                        .setDescription("Test description")
                        .setPrice(2.78)
                                .setCategory(new Category()
                                        .setCategoryId(1L)
                                        .setName("Drinks")),
                new Product()
                        .setProductId(2L)
                        .setName("Bread")
                        .setDescription("Description test")
                        .setPrice(1.25)
                        .setCategory(new Category()
                                .setCategoryId(2L)
                                .setName("Bakery")));
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void createProduct() {
    }

    @Test
    void getAllProducts() {
        when(productRepository.findAll()).thenReturn(mockProducts);
        List<Product> actualProducts = productController.getAllProducts();
        assertEquals(mockProducts, actualProducts);
    }

    @Test
    void getAllProductsInAdmin() {
    }

    @Test
    void getProductById() {
    }

    @Test
    void updateProduct() {
    }

    @Test
    void deleteProduct() {
        Product sampleProduct = mockProducts.get(0);
        when(productRepository.findById(sampleProduct.getProductId())).thenReturn(Optional.empty());
        productRepository.delete(sampleProduct);
        verify(productRepository).delete(sampleProduct);
    }
}