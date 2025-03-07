import axios from "axios";
import { defineStore } from "pinia";

const apiUrl = import.meta.env.VITE_API_URL;

export const useTaskStore = defineStore("task", {
    state: () => ({
        tasks: [],
        newTask: "",
    }),
    actions: {
        async getTasks() {
            try {
                const response = await axios.get(apiUrl);
                // console.log("API response:", response.data); // Verifica la estructura de los datos
                this.tasks = response.data.map(task => ({
                    id: task.id,
                    title: task.Task,
                    completed: task.Completed
                }));
            } catch (error) {
                console.log("Error getting tasks: " + error);
            }
        },
        async addTask() {
            if (!this.newTask.trim()) {
                console.log("Task title cannot be empty");
                return;
            }
            try {
                const newTaskData = {
                    task: this.newTask, 
                    completed: false,
                };
                // console.log("Datos enviados", newTaskData); // Verifica los datos enviados
                const response = await axios.post(apiUrl, newTaskData);
                // console.log("Respuesta de la api:", response.data); // Verifica la respuesta de la API
                this.tasks.push({
                    id: response.data.id,
                    title: response.data.task,
                    completed: response.data.completed
                });
                this.newTask = "";
            } catch (error) {
                if (error.response) {
                    // console.log("Error al agregar task:", error.response.data); // Verifica el mensaje de error del servidor
                } else {
                    console.log("Error adding task:", error.message);
                }
            }
        },
        async updateTask(task) {
            try {
                await axios.put(`${apiUrl}/${task.id}`, {
                    task: task.title, 
                    completed: task.completed
                });
            } catch (error) {
                console.log("Error updating task: " + error);
            }
        },
        async deleteTask(id) {
            try {
                await axios.delete(`${apiUrl}/${id}`);
                this.tasks = this.tasks.filter((task) => task.id !== id);
            } catch (error) {
                console.log("Error deleting task: " + error);
            }
        },
    },
});