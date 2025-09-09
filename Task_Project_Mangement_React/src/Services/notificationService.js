// import { post } from './api';
// export const createNotification = async (data) => post('/api/Notifications', data);

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/slices/authSlice";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API ||
  "";

export default function Notifications() {
  const { token, user } = useSelector(selectAuth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      let data = [];

      const candidates = [
        `${API_BASE}/api/notifications`,
        `${API_BASE}/notifications`,
      ];

      for (const url of candidates) {
        try {
          const res = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (res.ok) {
            const json = await res.json();
            data = Array.isArray(json) ? json : json?.items || [];
            if (data) break;
          }
        } catch {
          // continue
        }
      }

      if (!cancelled) {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="container">
      <div className="toolbar">
        <h1 className="page-title">Notifications</h1>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">*complete the project.</p>
      ) : (
        <div className="dash-rows">
          {items.map((n, i) => {
            const text = n.text ?? n.message ?? n.Message ?? "—";
            const ts =
              n.createdAt ?? n.timestamp ?? n.time ?? n.CreatedAt ?? null;
            return (
              <div key={i} className="dash-row">
                <div className="dash-row__title">
                  <div className="title">{text}</div>
                  {ts && (
                    <div className="small muted">
                      {new Date(ts).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}