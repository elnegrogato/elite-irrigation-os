// src/ops/mockData.ts
export const INBOX_MESSAGES = [
  { id: 'm1', from: 'James Henderson', source: 'SMS', preview: 'Is it possible to reschedule the site visit to 4pm?', time: '10m ago', unread: true },
  { id: 'm2', from: 'Oak Hills HOA', source: 'Email', preview: 'Approved the irrigation proposal. When can you start?', time: '2h ago', unread: true },
  { id: 'm3', from: 'Sarah Miller', source: 'Web Form', preview: 'New Lead: Irrigation inquiry from Matthews.', time: '4h ago', unread: false },
  { id: 'm4', from: '(704) 555-9821', source: 'Call', preview: 'Missed call. Voicemail: "Hey this is Mike..."', time: 'Yesterday', unread: false },
  { id: 'm5', from: 'Tech Park Facilities', source: 'Email', preview: 'RE: Maintenance Contract Renewal 2025', time: 'Yesterday', unread: false },
];

export const ACTIVITY_FEED = [
  { id: 'a1', type: 'call', desc: 'Outbound call to James H.', time: '2 hours ago', user: 'JD' },
  { id: 'a2', type: 'note', desc: 'Added gate code to property notes.', time: '4 hours ago', user: 'JD' },
  { id: 'a3', type: 'email', desc: 'Sent Estimate #4922 (Irrigation Repair).', time: 'Yesterday', user: 'System' },
  { id: 'a4', type: 'status', desc: 'Moved stage from "New" to "Estimated".', time: 'Yesterday', user: 'JD' },
];