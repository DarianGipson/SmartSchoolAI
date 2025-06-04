import React, { useEffect, useState } from 'react';
import { generateLesson, getExternalResources, getMotivationalMessage, getEnrichmentRemediation } from '../lib/aiLessonEngine';
import { Button } from '@/components/ui/button';
import { BookOpenText, Headphones, Video, Atom } from 'lucide-react';

/**
 * MultiModalLesson - Full-featured multi-modal lesson player.
 * Supports: text, audio, video, simulation, and visuals from lesson JSON.
 * Props:
 *   lesson: lesson JSON object
 *   audioUrl: string (optional)
 *   videoUrl: string (optional)
 *   simUrl: string (optional)
 */
export default function MultiModalLesson({ studentProfile, grade, subject, topic, audioUrl, videoUrl, simUrl }) {
  const [mode, setMode] = useState('text');
  const [lesson, setLesson] = useState(null);
  const [resources, setResources] = useState([]);
  const [motivation, setMotivation] = useState('');
  const [enrichment, setEnrichment] = useState([]);
  const [remediation, setRemediation] = useState([]);
  // Add state for auto-generated media URLs
  const [autoAudioUrl, setAudioUrl] = useState(audioUrl || null);
  const [autoVideoUrl, setVideoUrl] = useState(videoUrl || null);
  const [autoSimUrl, setSimUrl] = useState(simUrl || null);
  // Add state for media loading and error handling
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      const lessonData = await generateLesson({ grade, subject, topic, studentProfile });
      setLesson(lessonData);
      setResources(getExternalResources(subject, topic));
      setMotivation(getMotivationalMessage(studentProfile.mood || '', studentProfile));
      const { enrichment, remediation } = getEnrichmentRemediation(studentProfile, window.curriculumMap || []);
      setEnrichment(enrichment);
      setRemediation(remediation);
      // --- Auto-generate audio/video/sim URLs if not provided ---
      if (!audioUrl && lessonData.audioUrl) setAudioUrl(lessonData.audioUrl);
      if (!videoUrl && lessonData.videoUrl) setVideoUrl(lessonData.videoUrl);
      if (!simUrl && lessonData.simUrl) setSimUrl(lessonData.simUrl);
    }
    fetchLesson();
    // Reset media URLs and errors if props change
    setAudioUrl(audioUrl || null);
    setVideoUrl(videoUrl || null);
    setSimUrl(simUrl || null);
    setAudioError(false);
    setVideoError(false);
    setSimError(false);
  }, [grade, subject, topic, studentProfile, audioUrl, videoUrl, simUrl]);

  if (!lesson) return <div>Loading lesson...</div>;

  // Helper to render lesson steps with visuals
  const renderLessonSteps = () => (
    <div>
      <h5>Lesson Steps</h5>
      <ol>
        {lesson.steps?.map((step, i) => (
          <li key={i} style={{marginBottom: 12}}>
            <div>{step.instruction}</div>
            {step.visual && (
              <div style={{marginTop: 6}}>
                <img src={step.visual} alt={`Visual for step ${i + 1}`} style={{maxWidth: 300, borderRadius: 8}} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );

  // Helper to render practice questions
  const renderPractice = () => (
    <div style={{marginTop: 16}}>
      <h5>Practice</h5>
      <ul style={{listStyle: 'none', padding: 0}}>
        {lesson.practice?.map((q, i) => (
          <li key={i} style={{marginBottom: 12}}>
            <div>{q.question}</div>
            <div style={{fontSize: '0.95em', color: '#888'}}>Hint: {q.hint}</div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold mb-2">Multi-Modal Lesson Delivery</h4>
      <div className="flex gap-4 mb-4">
        <Button onClick={() => setMode('text')} className={`rounded-xl shadow-lg font-semibold text-base px-5 py-2 bg-smartSchool-blue hover:bg-blue-700 transition-transform duration-150 active:scale-95 flex items-center gap-2 ${mode==='text' ? 'ring-2 ring-smartSchool-blue' : ''}`}> <BookOpenText size={18} className="mr-1" /> Read Lesson </Button>
        <Button onClick={() => setMode('audio')} className={`rounded-xl shadow-lg font-semibold text-base px-5 py-2 bg-green-400 hover:bg-green-200 transition-transform duration-150 active:scale-95 flex items-center gap-2 ${mode==='audio' ? 'ring-2 ring-green-400' : ''}`}> <Headphones size={18} className="mr-1" /> Listen to Audio </Button>
        <Button onClick={() => setMode('video')} className={`rounded-xl shadow-lg font-semibold text-base px-5 py-2 bg-pink-400 hover:bg-pink-200 transition-transform duration-150 active:scale-95 flex items-center gap-2 ${mode==='video' ? 'ring-2 ring-pink-400' : ''}`}> <Video size={18} className="mr-1" /> Watch Video </Button>
        <Button onClick={() => setMode('sim')} className={`rounded-xl shadow-lg font-semibold text-base px-5 py-2 bg-yellow-400 hover:bg-yellow-200 transition-transform duration-150 active:scale-95 flex items-center gap-2 ${mode==='sim' ? 'ring-2 ring-yellow-400' : ''}`}> <Atom size={18} className="mr-1" /> Try Simulation </Button>
      </div>
      <div style={{marginTop: 16}}>
        {mode === 'text' && (
          <div>
            <h5>Intro</h5>
            <div style={{marginBottom: 12}}>{lesson.intro}</div>
            {renderLessonSteps()}
            {renderPractice()}
            <div style={{marginTop: 16, fontSize: '0.95em', color: '#888'}}>
              Progress: Completion {lesson.progress?.completion ?? 0}%, Retries: {lesson.progress?.retryCount ?? 0}
            </div>
            <div style={{marginTop: 16}}>
              <h5>Motivation</h5>
              <div>{motivation}</div>
            </div>
            <div style={{marginTop: 16}}>
              <h5>External Resources</h5>
              <ul>{resources.map((r, i) => <li key={i}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a></li>)}</ul>
            </div>
            <div style={{marginTop: 16}}>
              <h5>Enrichment</h5>
              <ul>{enrichment.map((e, i) => <li key={i}>{e}</li>)}</ul>
              <h5>Remediation</h5>
              <ul>{remediation.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          </div>
        )}
        {mode === 'audio' && (autoAudioUrl ? (
          <div>
            {audioLoading && <div>Loading audio...</div>}
            {audioError && <div style={{color: 'red'}}>Audio failed to load. Please try again later.</div>}
            <audio
              controls
              src={autoAudioUrl}
              style={{width: '100%'}}
              aria-label="Lesson audio"
              onLoadStart={() => { setAudioLoading(true); setAudioError(false); }}
              onCanPlayThrough={() => setAudioLoading(false)}
              onError={() => { setAudioLoading(false); setAudioError(true); }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <div style={{color: 'red'}}>This mode is not available for this lesson.</div>
        ))}
        {mode === 'video' && (autoVideoUrl ? (
          <div>
            {videoLoading && <div>Loading video...</div>}
            {videoError && <div style={{color: 'red'}}>Video failed to load. Please try again later.</div>}
            <video
              controls
              src={autoVideoUrl}
              style={{width: '100%', maxHeight: 400}}
              aria-label="Lesson video"
              title="Lesson video"
              onLoadStart={() => { setVideoLoading(true); setVideoError(false); }}
              onCanPlayThrough={() => setVideoLoading(false)}
              onError={() => { setVideoLoading(false); setVideoError(true); }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div style={{color: 'red'}}>This mode is not available for this lesson.</div>
        ))}
        {mode === 'sim' && (autoSimUrl ? (
          <div>
            {simLoading && <div>Loading simulation...</div>}
            {simError && <div style={{color: 'red'}}>Simulation failed to load. Please try again later.</div>}
            <iframe
              src={autoSimUrl}
              title="Simulation"
              style={{width: '100%', height: 400, border: '1px solid #ccc'}}
              aria-label="Lesson simulation"
              onLoad={() => setSimLoading(false)}
              onError={() => { setSimLoading(false); setSimError(true); }}
              onLoadStart={() => { setSimLoading(true); setSimError(false); }}
            />
          </div>
        ) : (
          <div style={{color: 'red'}}>This mode is not available for this lesson.</div>
        ))}
      </div>
    </div>
  );
}
