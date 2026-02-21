import "./App.css";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import ItemDetailPage from "./pages/ItemDetailPage";
import { Routes, Route } from "react-router-dom";
import PostItemPage from "./pages/PostItemPage";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />

        <Route path="/post" element={
            <PostItemPage />
        } />

        <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
      </Routes>
    </>
  );
}