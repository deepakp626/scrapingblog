import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import NavBar from "./components/NavBar";
import DashboardLayout from './layout/DashbordLayout';
import Home from './pages/Home/Home';
import WritePost from './pages/WritePost/WritePost';
import BlogList from './pages/bloglist/bloglist';
import UpdatePost from './pages/UpdatePost/UpdatePost';
import ViewBlog from './pages/ViewBlog/ViewBlog';

function App() {
  return (
    <>
      <Router>
        <div className="w-full">
          <Routes>
          <Route index path="/" element={<DashboardLayout children={<Home />} />} />
            <Route path="/about" element={<DashboardLayout children={<main><h1 className="text-2xl font-bold">About Page</h1></main>} />} />
            <Route path="/contact" element={<DashboardLayout children={<main><h1 className="text-2xl font-bold">Contact Page</h1></main>} />} />
            <Route path="/allblogs" element={<DashboardLayout children={<BlogList />} />} />
            <Route path="/write-post" element={<DashboardLayout children={<WritePost />} />} />
            {/* <Route path="/update-blog" element={<DashboardLayout children={<UpdatePost />} />} /> */}
            <Route
              path="/update-blog/:slug?"
              element={<DashboardLayout children={<UpdatePost />} />}
            />
            <Route
              path="/blogs/:slug?"
              element={<DashboardLayout children={<ViewBlog />} />}
            />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
