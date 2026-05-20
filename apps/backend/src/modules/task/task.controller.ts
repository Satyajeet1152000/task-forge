import { successResponse } from "@lib/api-response";
import type { CreateTaskInput, SubTaskParams, TaskParams, UpdateTaskInput, UpdateSubTaskCompletionInput } from "@task-forge/shared/types";
import type { FastifyReply, FastifyRequest } from "fastify";

import TaskService from "./task.service";

export class TaskController {
  create = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = request.body as CreateTaskInput;
    const task = await TaskService.create(request.userId, body);
    return reply.status(201).send(successResponse(task, "Task created successfully"));
  };

  getAll = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const tasks = await TaskService.getAll(request.userId);
    return reply.status(200).send(successResponse(tasks));
  };

  getById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = request.params as TaskParams;
    const task = await TaskService.getById(params.id, request.userId);
    return reply.status(200).send(successResponse(task));
  };

  update = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = request.params as TaskParams;
    const body = request.body as UpdateTaskInput;
    const task = await TaskService.update(params.id, request.userId, body);
    return reply.status(200).send(successResponse(task, "Task updated successfully"));
  };

  delete = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = request.params as TaskParams;
    await TaskService.delete(params.id, request.userId);
    return reply.status(200).send({
      success: true,
      message: "Task deleted successfully",
      data: null,
    });
  };

  updateSubTaskCompletion = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = request.params as SubTaskParams;
    const body = request.body as UpdateSubTaskCompletionInput;
    const taskData = await TaskService.updateSubTaskCompletion(
      params.id,
      params.subTaskId,
      request.userId,
      body.isCompleted,
    );
    return reply
      .status(200)
      .send(successResponse(taskData, "Subtask updated successfully"));
  };
}
