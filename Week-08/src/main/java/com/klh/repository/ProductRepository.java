package com.klh.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.klh.model.Product;
public interface ProductRepository extends JpaRepository<Product, Long> {
 //Derived methods
 List<Product> findByCategory(String category);
 List<Product> findByPriceBetween(double min, double max);
 //JPQL Methods
 @Query("SELECT p FROM Product p ORDER BY p.price ASC")
 List<Product> getProductsSortedByPrice();
 @Query("SELECT p FROM Product p WHERE p.price > :price")
 List<Product> getExpensiveProducts(double price);
 @Query("SELECT p FROM Product p WHERE p.category = :category")
 List<Product> getProductsByCategoryJPQL(String category);
}