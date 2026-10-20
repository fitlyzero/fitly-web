import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type ReactElement } from 'react';

import { GridSection } from '@/studio/section/components/grid/grid-section';
import { mapLocalGridSection } from '@/studio/section/mapper/local-section-mapper';
import type { TreeSectionMetadata } from '@/studio/section/model/section-metadata';
import type { DynamicTreeNode } from '@/studio/section/model/local-section.types';

const TreeItems = ({
  nodes,
  onSelect,
}: {
  nodes: DynamicTreeNode[];
  onSelect: (node: DynamicTreeNode) => void;
}): ReactElement => (
  <List dense disablePadding>
    {nodes.map((node) => (
      <Box key={node.key}>
        <ListItemButton onClick={() => onSelect(node)}>
          <ListItemText primary={node.title} secondary={node.description} />
        </ListItemButton>
        {node.children ? (
          <Box sx={{ pl: 2 }}>
            <TreeItems nodes={node.children} onSelect={onSelect} />
          </Box>
        ) : null}
      </Box>
    ))}
  </List>
);

const filterTreeNodes = (
  nodes: DynamicTreeNode[],
  search: string,
): DynamicTreeNode[] =>
  nodes.reduce<DynamicTreeNode[]>((result, node) => {
    const children = node.children ? filterTreeNodes(node.children, search) : undefined;
    const matches = `${node.title} ${node.description ?? ''}`
      .toLocaleLowerCase()
      .includes(search);
    if (matches || children?.length) result.push({ ...node, children });
    return result;
  }, []);

export const TreeSection = ({
  section,
}: {
  section: TreeSectionMetadata;
}): ReactElement => {
  const [selectedNode, setSelectedNode] = useState<DynamicTreeNode | null>(null);
  const [treeSearch, setTreeSearch] = useState('');
  const treeNodes = filterTreeNodes(
    section.tree.treeNodes,
    treeSearch.trim().toLocaleLowerCase(),
  );
  const recordList = selectedNode?.recordKey
    ? {
        ...section.tree.recordList,
        rows: section.tree.recordList.rows.filter(
          (row) => row.key === selectedNode.recordKey,
        ),
      }
    : section.tree.recordList;
  const gridSection = mapLocalGridSection(recordList);

  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr)' },
        minHeight: 0,
        p: { xs: 2, md: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{ alignSelf: 'start', border: 1, borderColor: 'divider', p: 1 }}
      >
        <Typography sx={{ p: 1 }} variant="subtitle1">
          {section.tree.treeTitle}
        </Typography>
        <TextField
          fullWidth
          onChange={(event) => setTreeSearch(event.target.value)}
          placeholder={section.tree.treeSearchPlaceholder}
          size="small"
          value={treeSearch}
        />
        <Box sx={{ mt: 1 }}>
          <TreeItems nodes={treeNodes} onSelect={setSelectedNode} />
        </Box>
      </Paper>
      <GridSection section={gridSection} />
    </Box>
  );
};
