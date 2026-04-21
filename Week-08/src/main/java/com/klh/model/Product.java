package com.klh.model;
import jakarta.persistence.*;
@Entity
@Table(name="product")
public class Product {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String name;
private String category;
private double price;

 // Getter and Setter methods
 public String getName() { return name; }
 public void setName(String name) { this.name = name; }
 public String getCategory() { return category; }

 public void setCategory(String category) { this.category = category; }
 public double getPrice() { return price; }
 public void setPrice(double price) { this.price = price; }
}