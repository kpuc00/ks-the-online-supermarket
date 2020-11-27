package com.ks.service.ks.controller;

import com.ks.service.ks.model.Category;
import com.ks.service.ks.service.CategoryService;
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
class CategoryControllerTest {
    @Autowired
    CategoryController categoryController;

    @MockBean
    CategoryService categoryService;

    List<Category> mockCategories;

    @BeforeEach
    void setUp() {
        mockCategories = Arrays.asList(
                new Category()
                        .setCategoryId(1L)
                        .setName("Drinks"),
                new Category()
                        .setCategoryId(2L)
                        .setName("Bakery")
        );
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void createCategory() {
    }

    @Test
    void getAllCategories() {
        when(categoryService.findAll()).thenReturn(mockCategories);
        List<Category> actualCategories = categoryController.getAllCategories();
        assertEquals(mockCategories, actualCategories);
    }

    @Test
    void getProductById() {
    }

    @Test
    void updateCategory() {
    }

    @Test
    void deleteCategory() {
        Category sampleCategory = mockCategories.get(0);
        when(categoryService.findById(sampleCategory.getCategoryId())).thenReturn(Optional.empty());
        categoryService.deleteById(sampleCategory.getCategoryId());
        verify(categoryService).deleteById(sampleCategory.getCategoryId());
    }
}