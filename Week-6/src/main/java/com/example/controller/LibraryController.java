package com.example.controller;
import com.example.model.Book;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController
@CrossOrigin("*")
public class LibraryController {

 private List<Book> bookList = new ArrayList<>();

 @GetMapping("/welcome")
 public String welcome() {
 return "Welcome to Online Library System";
 }

 @GetMapping("/count")
 public int totalBooks() {
 return 120;
 }

 @GetMapping("/price")
 public double bookPrice() {
 return 499.99;
 }
 @GetMapping("/books")
 public List<String> getBookTitles() {
 List<String> titles = new ArrayList<>();
 titles.add("Spring Boot in Action");
 titles.add("Java Programming");
 titles.add("Microservices Architecture");
 return titles;
 }

@GetMapping("/books/{id}")
 public Book getBookById(@PathVariable int id) {
 return new Book(id, "Full-stack development ", "Daniel Bugl's", 350.00);
 }

 @GetMapping("/search")
 public String searchBook(@RequestParam String title) {
 return "Book with title '" + title + "' found";
 }
 @GetMapping("/author/{name}")
 public String getAuthor(@PathVariable String name) {
 return "Books written by author: " + name;
 }
 @PostMapping("/addbook")
 public String addBook(@RequestBody Book book) {
 bookList.add(book);
 return "Book added successfully";
 }

 @GetMapping("/viewbooks")
 public List<Book> viewBooks() {
 return bookList;
 }
}
