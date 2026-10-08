package com.example.task_api.model;

import java.time.LocalDate;

public class Task {

    private long id;
    private String title;
    private String description;
    // LocalDate em vez de LocalDateTime: os exemplos do roteiro mandam so a data ("2026-12-31")
    private LocalDate dueDate;

    public Task() {
    }

    public Task(long id, String title, String description, LocalDate dueDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
