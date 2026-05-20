import type { Task, TaskMemberSummary, TeamMemberUser } from "@task-forge/shared/types";
import * as XLSX from "xlsx";

import {
  formatTaskDate,
  getSubTaskProgress,
  TASK_PRIORITY_STYLES,
  TASK_STATUS_STYLES,
} from "@/modules/task/task.utils";

export type ReportFor = "task-report" | "team-report";

type ReportRow = Record<string, string | number>;

export interface TaskReportInput {
  tasks: Task[];
  assignedMembers: Record<string, TaskMemberSummary>;
}

export interface TeamReportInput {
  members: TeamMemberUser[];
}

type GenerateReportParams =
  | {
      reportFor: "task-report";
      fileName: string;
      data: TaskReportInput;
    }
  | {
      reportFor: "team-report";
      fileName: string;
      data: TeamReportInput;
    };

function formatAssignedMemberNames(
  memberIds: number[],
  assignedMembers: Record<string, TaskMemberSummary>,
): string {
  if (memberIds.length === 0) {
    return "—";
  }

  const filteredMembers: TaskMemberSummary[] = [];
  for (const memberId of memberIds) {
    const member = assignedMembers[String(memberId)];
    if (member) {
      filteredMembers.push(member);
    }
  }

  const memberNames = filteredMembers.map((member) => `${member.name} (${member.email})`);

  return memberNames.length > 0 ? memberNames.join(", ") : "—";
}

function formatTaskReportRows(input: TaskReportInput): ReportRow[] {
  return input.tasks.map((task) => {
    const subTaskProgress = getSubTaskProgress(task.subTasks);
    const statusLabel = TASK_STATUS_STYLES[task.status].label;
    const priorityLabel = TASK_PRIORITY_STYLES[task.priority].label;

    return {
      ID: task.id,
      Title: task.title.trim(),
      Description: task.description?.trim() ?? "",
      Status: statusLabel,
      Priority: priorityLabel,
      "Due Date": formatTaskDate(task.dueDate),
      "Created On": formatTaskDate(task.createdAt),
      "Assigned Members": formatAssignedMemberNames(task.assignedMembers, input.assignedMembers),
      "Total Subtasks": task.subTasks.length,
      "Completed Subtasks": subTaskProgress.completed,
      "Subtask Progress (%)": subTaskProgress.percent + "%",
      Attachments: task.attachments.length,
    };
  });
}

function formatTeamReportRows(input: TeamReportInput): ReportRow[] {
  return input.members.map((member) => {
    const totalTasks =
      member.taskStats.pending + member.taskStats.inProgress + member.taskStats.completed;

    return {
      Name: member.name.trim(),
      Email: member.email.trim(),
      "Pending Tasks": member.taskStats.pending,
      "In Progress Tasks": member.taskStats.inProgress,
      "Completed Tasks": member.taskStats.completed,
      "Total Tasks": totalTasks,
    };
  });
}

function formatReportRows(params: GenerateReportParams): ReportRow[] {
  if (params.reportFor === "task-report") {
    return formatTaskReportRows(params.data);
  }
  return formatTeamReportRows(params.data);
}

export default function generateReport(params: GenerateReportParams): void {
  const rows = formatReportRows(params);

  if (rows.length === 0) {
    throw new Error("No data available to generate report");
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  triggerFileDownload(blob, `${params.fileName}.xlsx`);
}

function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.click();
  URL.revokeObjectURL(url);
}
