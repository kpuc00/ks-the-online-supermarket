package com.ks.service.ks.resources;

import com.ks.service.ks.database.FakeDatabase;
import com.ks.service.ks.model.Category;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryResources {
    private static final FakeDatabase fakeDb = new FakeDatabase();

    @PostMapping("/add")
    public ResponseEntity<Category> createCategory (@RequestBody Category category){
        fakeDb.addCategory(category);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @GetMapping // /categories
    public ResponseEntity<List<Category>> getAllCategories() {
        if (fakeDb.getAllCategories() != null)
            return new ResponseEntity<>(fakeDb.getAllCategories(), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable long id) {
        Category category = fakeDb.getCategory(id);
        if (category != null)
            return new ResponseEntity<>(fakeDb.getCategory(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable long id, @RequestBody Category category){
        if (fakeDb.editCategory(id, category))
            return new ResponseEntity<>(category, HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Category> deleteCategory(@PathVariable long id){
        if (fakeDb.deleteCategory(id))
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
