import { Box, Chip, Divider, Typography } from '@mui/material';
import { useState, type ReactElement } from 'react';

import { SectionCard } from '@/components/SectionCard';
import { MetadataForm } from '@/studio/section/components/form/metadata-form';
import type {
  DynamicFormSection,
  DynamicFormValues,
  DynamicHeroSection,
  DynamicStatsSection,
} from '@/studio/section/model/local-section.types';

export const HeroSection = ({
  section,
}: {
  section: DynamicHeroSection;
}): ReactElement => (
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    <Chip label={section.eyebrow} size="small" />
    <Typography component="h2" sx={{ mt: 1.5 }} variant="h2">
      {section.title}
    </Typography>
    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
      {section.description}
    </Typography>
  </Box>
);

export const StatsSection = ({
  section,
}: {
  section: DynamicStatsSection;
}): ReactElement => (
  <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
    <Typography component="h2" variant="h3">{section.title}</Typography>
    {section.description ? (
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        {section.description}
      </Typography>
    ) : null}
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        mt: 2,
      }}
    >
      {section.items.map((item) => (
        <SectionCard key={item.label}>
          <Typography color="text.secondary" variant="caption">
            {item.label}
          </Typography>
          <Typography sx={{ my: 0.5 }} variant="h2">{item.value}</Typography>
          {item.helper ? (
            <Typography color="text.secondary" variant="body2">
              {item.helper}
            </Typography>
          ) : null}
        </SectionCard>
      ))}
    </Box>
  </Box>
);

export const FormSection = ({
  section,
}: {
  section: DynamicFormSection;
}): ReactElement => {
  const [submission, setSubmission] = useState<DynamicFormValues | null>(null);

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
      <SectionCard>
        <Typography component="h2" variant="h3">{section.title}</Typography>
        {section.description ? (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {section.description}
          </Typography>
        ) : null}
        <Box sx={{ mt: 2 }}>
          <MetadataForm
            fields={section.fields}
            onSubmit={(values) => setSubmission(values)}
            submitLabel={section.submitLabel}
          />
        </Box>
        {submission ? (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography color="success.main" variant="body2">
              {section.successMessage}
            </Typography>
            {section.snapshotTitle ? (
              <Typography sx={{ mt: 1 }} variant="subtitle2">
                {section.snapshotTitle}
              </Typography>
            ) : null}
            <Box
              component="pre"
              sx={{ bgcolor: 'grey.50', fontSize: 12, m: 0, mt: 1, overflow: 'auto', p: 1.5 }}
            >
              {JSON.stringify(submission, null, 2)}
            </Box>
          </Box>
        ) : null}
      </SectionCard>
    </Box>
  );
};
