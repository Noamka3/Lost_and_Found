import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const EMOJIS = {
  "Wallet / Purse": "👛",
  Keys: "🔑",
  Electronics: "📱",
  "Bags / Backpacks": "🎒",
  Glasses: "👓",
  "Textbooks / Notes": "📚",
  "ID / Student Card": "🪪",
  "Water Bottle": "💧",
  Clothing: "🧥",
  Phone: "📱",
  Laptop: "💻",
  "Earbuds / Headphones": "🎧",
  Charger: "🔌",
  Umbrella: "☂️",
  Jewelry: "💍",
  Watch: "⌚",
  Shoes: "👟",
  "Jacket / Coat": "🧥",
  Money: "💵",
  Documents: "📄",
  Other: "📦",
};

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwner = user?.id === item?.user_id;
  const icon = useMemo(() => EMOJIS[item?.category] || "📦", [item?.category]);

  useEffect(() => {
    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadItem() {
    setLoading(true);

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      notifications.show({ message: "Item not found", color: "red" });
      navigate("/");
      return; // חשוב: לא להמשיך
    }

    setItem(data);
    setLoading(false);
  }

  async function handleDelete() {
    const ok = confirm("Are you sure you want to delete this item?");
    if (!ok) return;

    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      notifications.show({ message: error.message, color: "red" });
      return;
    }

    notifications.show({ message: "Item deleted ✅", color: "green" });
    navigate("/");
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>
        ⏳ Loading...
      </div>
    );
  }

  if (!item) return null;

  return (
    <div style={{ background: "#f0f4ff", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div
          style={{
            fontSize: "13px",
            color: "#64748b",
            marginBottom: "28px",
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#2563eb" }}>
            🏠 Home
          </span>
          <span>›</span>
          <span>Item Details</span>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            boxShadow: "0 4px 24px rgba(37,99,235,0.10)",
          }}
        >
          {/* Image */}
          <div
            style={{
              background: "#f8faff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "100px",
              minHeight: "300px",
              borderRight: "1px solid #e2e8f0",
            }}
          >
            {icon}
          </div>

          {/* Info */}
          <div style={{ padding: "36px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: 800 }}>{item.title}</h2>

              <span
                style={{
                  padding: "3px 12px",
                  borderRadius: "50px",
                  fontSize: "12px",
                  fontWeight: 700,
                  background: item.status === "lost" ? "#fee2e2" : "#d1fae5",
                  color: item.status === "lost" ? "#ef4444" : "#10b981",
                }}
              >
                {item.status.toUpperCase()}
              </span>
            </div>

            {[
              ["Category", item.category],
              ["Location", `📍 ${item.location}`],
              ["Posted by", `👤 ${item.user_name}`],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{ display: "flex", gap: "8px", marginBottom: "10px", fontSize: "14px" }}
              >
                <strong style={{ color: "#64748b", minWidth: "80px" }}>{label}:</strong>
                <span>{value}</span>
              </div>
            ))}

            {/* Description */}
            {item.description && (
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Description
                </div>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            )}

            {/* Contact */}
            <div
              style={{
                marginTop: "20px",
                background: "#f8faff",
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #e2e8f0",
              }}
            >
              {user ? (
                <>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "6px" }}>
                    CONTACT
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>📞 {item.contact_method}</div>
                </>
              ) : (
                <div style={{ fontSize: "13px", color: "#2563eb" }}>
                  🔒{" "}
                  <span
                    onClick={() => navigate("/login")}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    Login
                  </span>{" "}
                  to view contact info
                </div>
              )}
            </div>

            {/* Delete button */}
            {isOwner && (
              <button
                onClick={handleDelete}
                style={{
                  marginTop: "16px",
                  padding: "8px 20px",
                  borderRadius: "50px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🗑️ Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}