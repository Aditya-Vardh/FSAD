package com.klh.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.klh.model.Product;
import com.klh.repository.ProductRepository;
@RestController
@RequestMapping("/products")
public class ProductController {
 @Autowired
 private ProductRepository repo;
 @GetMapping("/category/{category}")
 public List<Product> getByCategory(@PathVariable String category){
 return repo.findByCategory(category);
 }
 @GetMapping("/filter")
 public List<Product> filterByPrice(@RequestParam double
min,@RequestParam double max){
 return repo.findByPriceBetween(min, max);
 }
 @GetMapping("/sorted")
 public List<Product> sortedProducts(){
 return repo.getProductsSortedByPrice();
 }
 @GetMapping("/expensive/{price}")
 public List<Product> expensiveProducts(@PathVariable double price){
 return repo.getExpensiveProducts(price);
 }
}
