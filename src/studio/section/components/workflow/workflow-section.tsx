import { Box, Chip, Paper, Typography } from '@mui/material';
import { useEffect, useState, type DragEvent, type ReactElement } from 'react';

import type {
  DynamicWorkflowSection,
  DynamicWorkflowTask,
} from '@/studio/section/model/local-section.types';

interface WorkflowSectionProps {
  section: DynamicWorkflowSection;
}

export const WorkflowSection = ({ section }: WorkflowSectionProps): ReactElement => {
  const [tasks, setTasks] = useState(section.tasks);
  const [draggedTaskKey, setDraggedTaskKey] = useState<string | null>(null);

  useEffect(() => setTasks(section.tasks), [section.tasks]);

  const moveTask = (stageKey: string) => {
    if (!draggedTaskKey) return;
    setTasks((current) => current.map((task) => task.key === draggedTaskKey ? { ...task, stageKey } : task));
    setDraggedTaskKey(null);
  };

  return (
    <Box>
      <Typography component="h2" variant="h3">{section.title}</Typography>
      {section.description ? <Typography color="text.secondary" sx={{ mt: 0.5 }}>{section.description}</Typography> : null}
      {section.summary ? (
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', my: 2 }}>
          {section.summary.map((item) => (
            <Paper elevation={0} key={item.label} sx={{ border: 1, borderColor: 'divider', p: 2 }}>
              <Typography color="text.secondary" variant="caption">{item.label}</Typography>
              <Typography variant="h2">{item.value}</Typography>
            </Paper>
          ))}
        </Box>
      ) : null}
      <Box sx={{ display: 'grid', gap: 1.5, gridAutoColumns: 'minmax(220px, 1fr)', gridAutoFlow: 'column', overflowX: 'auto', pb: 1 }}>
        {section.stages.map((stage) => {
          const stageTasks = tasks.filter((task) => task.stageKey === stage.key);
          return (
            <Paper
              data-workflow-stage-key={stage.key}
              elevation={0}
              key={stage.key}
              onDragOver={(event: DragEvent) => event.preventDefault()}
              onDrop={() => moveTask(stage.key)}
              sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider', minHeight: 220, p: 1.5 }}
            >
              <Typography component="h3" variant="subtitle1">{stage.title}</Typography>
              <Box sx={{ display: 'grid', gap: 1, mt: 1.5 }}>
                {stageTasks.map((task: DynamicWorkflowTask) => (
                  <Paper
                    data-workflow-task-key={task.key}
                    draggable
                    elevation={0}
                    key={task.key}
                    onDragEnd={() => setDraggedTaskKey(null)}
                    onDragStart={() => setDraggedTaskKey(task.key)}
                    sx={{ border: 1, borderColor: 'divider', cursor: 'grab', p: 1.5 }}
                  >
                    <Typography sx={{ fontWeight: 600 }} variant="body2">{task.title}</Typography>
                    {task.description ? <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="caption">{task.description}</Typography> : null}
                    {task.statusLabel ? <Chip label={task.statusLabel} size="small" sx={{ mt: 1 }} /> : null}
                  </Paper>
                ))}
                {stageTasks.length === 0 ? <Typography color="text.secondary" variant="body2">{section.emptyStageText ?? 'No tasks'}</Typography> : null}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};
