'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AntiScreenshot from '@/components/AntiScreenshot';

export default function Chat() {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const fetchMessages = useCallback(async () => {
    const token = getCookie('token');
    if (!token || !roomId) return;
    const res = await fetch(`/api/chat?token=${token}&roomId=${roomId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
  }, [roomId]);

  const joinRoom = async () => {
    const token = getCookie('token');
    if (!token || !roomId) return;

    const joinRes = await fetch('/api/chat/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, roomId }),
    });
    if (!joinRes.ok) {
      const err = await joinRes.json();
      alert(err.error || 'Cannot join room');
      return;
    }
    setJoined(true);
    await fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 2000);
  };

  const sendMsg = async () => {
    const token = getCookie('token');
    if (!token || !text.trim()) return;
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, roomId, text }),
    });
    setText('');
    await fetchMessages();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const token = getCookie('token');
    if (!token) router.push('/');
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <AntiScreenshot />
      {!joined ? (
        <div className="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded">
          <h2 className="text-xl mb-4">Enter Room ID (private chat for 2)</h2>
          <input className="w-full p-2 rounded bg-gray-700 mb-3" placeholder="Room ID"
            value={roomId} onChange={e => setRoomId(e.target.value)} />
          <button onClick={joinRoom}
            className="w-full bg-green-600 p-2 rounded hover:bg-green-700">Join Room</button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 h-96 overflow-y-auto p-4 rounded mb-2">
            {messages.map((m, i) => (
              <div key={i} className="mb-1"><b>{m.from}:</b> {m.text}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 p-2 rounded bg-gray-700"
              value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()} />
            <button onClick={sendMsg}
              className="bg-blue-600 px-4 rounded hover:bg-blue-700">Send</button>
          </div>
        </div>
      )}
    </main>
  );
}
