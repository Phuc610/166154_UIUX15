import { readFileSync, writeFileSync } from 'fs';

// Map of file -> list of unused identifiers to remove
const fixes = {
  'src/AIAssistant.tsx': { removeReact: true, removeImports: ['ChatCircleText','CaretRight','User','CheckCircle','Heartbeat','Pill','Stethoscope','ArrowRight'], removeVars: ['navigate'] },
  'src/App.tsx': { removeReact: true },
  'src/Appointments.tsx': { removeImports: ['SquaresFour','List','DotsThreeVertical'] },
  'src/ClinicSettings.tsx': { removeImports: ['ArrowCounterClockwise'] },
  'src/DashboardOverview.tsx': { removeReact: true },
  'src/DoctorChangePassword.tsx': { removeImports: ['User','Bell','NavLink'] },
  'src/DoctorDashboard.tsx': { removeReact: true, removeImports: ['Bell','User','FileText','Chat','Gear','SquaresFour','Hexagon','Target','ArrowsDownUp','CaretLeft','Stethoscope','Heartbeat'] },
  'src/DoctorNotificationsSettings.tsx': { removeImports: ['User','Lock','Bell','ClockCounterClockwise','Receipt','NavLink'] },
  'src/DoctorProfileSettings.tsx': { removeImports: ['User','Lock','Bell','NavLink'] },
  'src/DoctorSchedule.tsx': { removeReact: true, removeImports: ['Chat','Gear','Hexagon','Bell','User','ArrowsDownUp','Target','SquaresFour','MagnifyingGlass','Sparkle','Drop'] },
  'src/Doctors.tsx': { removeImports: ['Eye','CaretLeft','CaretRight'] },
  'src/ExportReport.tsx': { removeReact: true, removeImports: ['User','Users'] },
  'src/LandingPage.tsx': { removeImports: ['CaretRight'] },
  'src/MedicalExamination.tsx': { removeReact: true, removeImports: ['User','ArrowRight'] },
  'src/MedicalRecordDetail.tsx': { removeReact: true },
  'src/MedicalRecords.tsx': { removeReact: true, removeImports: ['Funnel','Heartbeat'] },
  'src/Messages.tsx': { removeReact: true },
  'src/NewAppointmentModal.tsx': { removeImports: ['CalendarBlank','Clock'] },
  'src/PatientChatbot.tsx': { removeReact: true, removeImports: ['Warning','MagnifyingGlass'] },
  'src/PatientConsultDoctor.tsx': { removeReact: true, removeImports: ['CaretDown'], removeVars: ['setDoctorsList','handleSaveNote'] },
  'src/PatientDashboard.tsx': { removeReact: true, removeImports: ['Heartbeat','ArrowUpRight','ArrowDownRight'] },
  'src/PatientDoctorDetails.tsx': { removeReact: true, removeImports: ['CheckCircle'] },
  'src/PatientDoctors.tsx': { removeReact: true, removeImports: ['CalendarPlus'] },
};

for (const [filePath, fix] of Object.entries(fixes)) {
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  // Remove React default import (keep named imports if any)
  if (fix.removeReact) {
    // "import React, { ... } from 'react';" -> "import { ... } from 'react';"
    content = content.replace(/^import React,\s*(\{[^}]+\})\s*from\s*'react';/m, "import $1 from 'react';");
    // "import React from 'react';" -> remove entirely
    content = content.replace(/^import React\s*from\s*'react';\n?/m, '');
    // "import React, { useState, ... } from 'react';" (fallback)
    content = content.replace(/^import React,\s*\{\s*([\w\s,]+)\s*\}\s*from\s*'react';/m, (_, named) => {
      const trimmed = named.trim();
      return trimmed ? `import { ${trimmed} } from 'react';` : '';
    });
  }

  // Remove unused named imports from phosphor or react-router
  if (fix.removeImports) {
    for (const imp of fix.removeImports) {
      // Remove "ImpName," or ", ImpName" from import braces
      content = content.replace(new RegExp(`\\b${imp}\\s*,\\s*`, 'g'), '');
      content = content.replace(new RegExp(`,\\s*${imp}\\b`, 'g'), '');
      content = content.replace(new RegExp(`\\b${imp}\\b`, 'g'), (match, offset) => {
        // Only remove if it's in an import statement context - handled above
        return match;
      });
    }
    // Second pass: just remove the exact words from import lines
    const lines = content.split('\n');
    content = lines.map(line => {
      if (!line.trim().startsWith('import')) return line;
      for (const imp of fix.removeImports) {
        // Remove word with surrounding comma/space
        line = line.replace(new RegExp(`\\b${imp}\\b,?\\s*`, 'g'), '');
        line = line.replace(new RegExp(`,\\s*\\b${imp}\\b`, 'g'), '');
      }
      // Clean up trailing commas before closing brace
      line = line.replace(/,\s*}/g, ' }');
      return line;
    }).join('\n');
  }

  // Remove unused const variables (simple one-liner useState destructure)
  if (fix.removeVars) {
    for (const varName of fix.removeVars) {
      // const [items, setItems] = useState -> const [items] = useState
      content = content.replace(new RegExp(`,\\s*${varName}\\b`, 'g'), '');
      content = content.replace(new RegExp(`\\b${varName}\\s*,`, 'g'), '');
      // remove standalone const varName = ...
      content = content.replace(new RegExp(`^\\s*const\\s+${varName}\\s*=.*$\\n?`, 'm'), '');
    }
  }

  if (content !== original) {
    writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`No change: ${filePath}`);
  }
}

console.log('\nDone! Now handling RefObject type mismatches in Expenses.tsx and Invoices.tsx...');
