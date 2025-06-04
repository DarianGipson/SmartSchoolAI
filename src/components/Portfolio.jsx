import React, { useState } from 'react';

export default function Portfolio({ projects, onUpload }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(null); // index of expanded project
  const [localProjects, setLocalProjects] = useState(projects);
  const [uploadingProject, setUploadingProject] = useState(null); // {name, type, description}
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleUpload = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      let newProject = uploadingProject;
      if (!newProject || !newProject.name || !newProject.type) {
        setError('Please provide project name and type.');
        setLoading(false);
        return;
      }
      await Promise.resolve(onUpload(newProject));
      setSuccess(true);
      setLocalProjects([newProject, ...localProjects]);
      setUploadingProject(null);
      setShowUploadForm(false);
    } catch (e) {
      setError('Failed to upload project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Portfolio summary
  const summary = localProjects.length > 0 ? `You have uploaded ${localProjects.length} project${localProjects.length > 1 ? 's' : ''}.` : 'No projects uploaded yet.';

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-blue/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-blue mb-4 font-poppins drop-shadow">Student Portfolio</h4>
      <div className="w-full text-gray-600 text-sm mb-2">{summary}</div>
      <ul className="w-full mb-4 list-disc ml-6">
        {localProjects.map((p, i) => (
          <li key={i} className="mb-1 text-gray-800 animate-fade-in-slow">
            <button className="text-left w-full focus:outline-none" onClick={() => setExpanded(expanded === i ? null : i)}>
              <span className="font-semibold">{p.name}</span> <span className="text-gray-400">({p.type})</span>
              {expanded === i ? ' ▲' : ' ▼'}
            </button>
            {expanded === i && (
              <div className="mt-2 ml-2 p-2 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
                <div><span className="font-semibold">Description:</span> {p.description || 'No description provided.'}</div>
                {p.date && <div><span className="font-semibold">Date:</span> {new Date(p.date).toLocaleDateString()}</div>}
                {/* Add more fields as needed */}
              </div>
            )}
          </li>
        ))}
      </ul>
      {showUploadForm ? (
        <form onSubmit={handleUpload} className="w-full flex flex-col gap-2 mb-2 animate-fade-in">
          <input
            type="text"
            placeholder="Project Name"
            className="px-3 py-2 rounded border border-gray-300"
            value={uploadingProject?.name || ''}
            onChange={e => setUploadingProject({ ...uploadingProject, name: e.target.value })}
            disabled={loading}
            required
          />
          <input
            type="text"
            placeholder="Project Type (e.g. App, Essay)"
            className="px-3 py-2 rounded border border-gray-300"
            value={uploadingProject?.type || ''}
            onChange={e => setUploadingProject({ ...uploadingProject, type: e.target.value })}
            disabled={loading}
            required
          />
          <textarea
            placeholder="Description (optional)"
            className="px-3 py-2 rounded border border-gray-300"
            value={uploadingProject?.description || ''}
            onChange={e => setUploadingProject({ ...uploadingProject, description: e.target.value })}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Uploading...' : 'Submit Project'}
          </button>
          <button type="button" className="text-sm text-gray-500 underline" onClick={() => setShowUploadForm(false)} disabled={loading}>Cancel</button>
        </form>
      ) : (
        <button
          onClick={() => { setShowUploadForm(true); setSuccess(false); setError(null); }}
          disabled={loading}
          aria-label="Upload new project"
          className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 mt-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Uploading...' : success ? 'Uploaded!' : 'Upload New Project'}
        </button>
      )}
      {success && <span className="text-green-600 font-semibold animate-bounce mt-2">Project uploaded!</span>}
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Showcase your best work and achievements here! Click a project to see more details.</div>
    </div>
  );
}
