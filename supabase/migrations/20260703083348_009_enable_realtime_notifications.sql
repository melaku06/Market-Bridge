/*
# Enable Realtime on Notifications Table

1. Purpose
- Enable Supabase Realtime (WebSocket-based) on the notifications table so that
  clients receive instant notification updates without polling.
- Each user subscribes to their own notifications filtered by user_id.

2. Changes
- Add the notifications table to the realtime publication.
- This allows clients to subscribe to INSERT/UPDATE/DELETE events on notifications
  filtered by user_id using Supabase's realtime channel API.

3. Security
- RLS is already enabled on the notifications table.
- Realtime respects RLS policies — clients can only receive events for rows
  they are authorized to read (their own notifications).
*/

-- Enable realtime on the notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Ensure the table has REPLICA IDENTITY FULL so UPDATE/DELETE events
-- carry the full row data (needed for realtime payloads)
ALTER TABLE notifications REPLICA IDENTITY FULL;
