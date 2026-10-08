package com.example.task_api.repository;

import com.example.task_api.model.Task;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class TaskRepository {

    private final List<Task> tasks = new CopyOnWriteArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong();

    public List<Task> findAll() {
        return new ArrayList<>(tasks);
    }

    public Task findById(long id) {
        return tasks.stream()
                .filter(task -> task.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public Task save(Task task) {
        if (task.getId() == 0) {
            task.setId(idGenerator.incrementAndGet());
        } else {
            tasks.removeIf(t -> t.getId() == task.getId());
            // se o id veio no JSON, o gerador pula ele para nao repetir id depois
            idGenerator.accumulateAndGet(task.getId(), Math::max);
        }
        tasks.add(task);
        return task;
    }

    public boolean delete(long id) {
        return tasks.removeIf(t -> t.getId() == id);
    }
}
