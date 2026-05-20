import { z } from "zod";

import { RouteTags } from "../types/swagger.types";
import { TaskPriority, TaskStatus } from "../types/task.types";

import { successResponseSchema } from "./common-schemas";

export const subTaskInputSchema = z.object({
  title: z.string().min(1, "Subtask title is required").max(250, "Subtask title is too long"),
  isCompleted: z.boolean().optional(),
});

export const taskMemberSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
});

export const subTaskSchema = z.object({
  id: z.number(),
  userId: z.number(),
  taskId: z.number(),
  title: z.string(),
  isCompleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const taskSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  subTasks: z.array(subTaskSchema),
  assignedMembers: z.array(z.number()),
  attachments: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskBodySchema = z.object({
  title: z.string().min(1, "Title is required").max(250, "Title is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  startDate: z.string().datetime({ message: "Start date must be a valid ISO date" }).optional(),
  dueDate: z.string().datetime({ message: "Due date must be a valid ISO date" }).optional(),
  assignedMembers: z.array(z.number().int().positive()).optional(),
  attachments: z.array(z.string().url("Each attachment must be a valid URL")).optional(),
  subTasks: z.array(subTaskInputSchema).optional(),
});

export const updateTaskBodySchema = createTaskBodySchema.partial();

export const tasksListDataSchema = z.object({
  tasks: z.array(taskSchema),
  assignedMembers: z.record(z.string(), taskMemberSummarySchema),
  subTasks: z.record(z.string(), subTaskSchema),
});

export const taskParamsSchema = z.object({
  id: z.coerce.number().int().positive("Task id must be a positive integer"),
});

export const postCreateTaskRouteSchema = {
  tags: [RouteTags.TASKS],
  summary: "Create task",
  description: "Create a new task with optional subtasks and member assignments",
  body: createTaskBodySchema,
  requestBodyExample: {
    title: "Design Homepage",
    description: "Create a clean and modern homepage layout using Tailwind CSS.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    startDate: "2025-03-16T00:00:00.000Z",
    dueDate: "2025-03-31T00:00:00.000Z",
    assignedMembers: [1, 2],
    attachments: ["https://example.com/spec.pdf"],
    subTasks: [
      { title: "Wireframe layout", isCompleted: true },
      { title: "Build hero section", isCompleted: false },
    ],
  },
  response: {
    201: successResponseSchema(taskSchema),
  },
};

export const getTasksRouteSchema = {
  tags: [RouteTags.TASKS],
  summary: "List tasks",
  description: "Return all tasks with assigned member and subtask lookup maps",
  response: {
    200: successResponseSchema(tasksListDataSchema),
  },
};

export const getTaskByIdRouteSchema = {
  tags: [RouteTags.TASKS],
  summary: "Get task by id",
  description: "Return a single task by id",
  params: taskParamsSchema,
  response: {
    200: successResponseSchema(taskSchema),
  },
};

export const putUpdateTaskRouteSchema = {
  tags: [RouteTags.TASKS],
  summary: "Update task",
  description: "Update an existing task",
  params: taskParamsSchema,
  body: updateTaskBodySchema,
  response: {
    200: successResponseSchema(taskSchema),
  },
};

export const deleteTaskRouteSchema = {
  tags: [RouteTags.TASKS],
  summary: "Delete task",
  description: "Delete a task and its subtasks",
  params: taskParamsSchema,
  response: {
    200: successResponseSchema(z.null()),
  },
};
