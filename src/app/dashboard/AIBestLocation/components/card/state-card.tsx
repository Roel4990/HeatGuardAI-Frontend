'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function StateCard({
                                    label,
                                    value,
                                    unit,
                                  }: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <Paper
			variant="outlined"
      sx={{
        borderRadius: 2,
        p: 2,
        transition: (theme) => theme.transitions.create('box-shadow'),
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
        {label}
      </Typography>

      <Typography sx={{ fontWeight: 900, fontSize: 18, mt: 0.5 }}>
        {value}
        {unit ? ` ${unit}` : ''}
      </Typography>
    </Paper>
  );
}
