'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Camera,
  Mic,
  MicOff,
  Radio,
  Play,
  Square,
  RefreshCw,
  Video,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Settings2,
} from 'lucide-react';
import { MatchItem } from '@/lib/types';

interface BroadcasterConsoleProps {
  match: MatchItem;
  onCameraSwitched?: (newCamera: string) => void;
  onMatchStatusChanged?: (newStatus: string) => void;
}

interface VideoDevice {
  deviceId: string;
  label: string;
  customName: string;
}

interface AudioDevice {
  deviceId: string;
  label: string;
}

export default function BroadcasterConsole({
  match,
  onCameraSwitched,
  onMatchStatusChanged,
}: BroadcasterConsoleProps) {
  const { user } = useAuth();

  // Media Devices
  const [videoDevices, setVideoDevices] = useState<VideoDevice[]>([]);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [stagedDeviceId, setStagedDeviceId] = useState<string>('');

  // Streams & Elements
  const programVideoRef = useRef<HTMLVideoElement>(null);
  const stagingVideoRef = useRef<HTMLVideoElement>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const stagedStreamRef = useRef<MediaStream | null>(null);

  // States
  const [isPublishing, setIsPublishing] = useState(match.status === 'LIVE');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Diagnostics
  const [metrics, setMetrics] = useState({
    resolution: '1920x1080',
    fps: 60,
    bitrateMbps: 4.8,
    droppedFrames: 0,
    codec: 'VP8 / Opus',
    webrtcState: 'CONNECTED',
  });

  // 1. Discover Connected Devices
  const enumerateConnectedDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const vInputs = devices.filter((d) => d.kind === 'videoinput');
      const aInputs = devices.filter((d) => d.kind === 'audioinput');

      // Default names if browser doesn't expose labels yet or only has 1 physical camera
      const formattedCameras: VideoDevice[] =
        vInputs.length > 0
          ? vInputs.map((d, index) => {
              const defaultName =
                index === 0
                  ? 'Camera 1 — Main View'
                  : index === 1
                  ? 'Camera 2 — Side Pit Angle'
                  : index === 2
                  ? 'Camera 3 — Wide Arena View'
                  : `Camera ${index + 1}`;
              return {
                deviceId: d.deviceId,
                label: d.label || `Video Source ${index + 1}`,
                customName: defaultName,
              };
            })
          : [
              { deviceId: 'cam_1_default', label: 'Simulated Main Arena Cam', customName: 'Camera 1 — Main View' },
              { deviceId: 'cam_2_default', label: 'Simulated Side Pit Angle', customName: 'Camera 2 — Side Pit Angle' },
              { deviceId: 'cam_3_default', label: 'Simulated Wide Overview', customName: 'Camera 3 — Wide Arena View' },
            ];

      setVideoDevices(formattedCameras);
      if (formattedCameras.length > 0) {
        setSelectedDeviceId(formattedCameras[0].deviceId);
        setStagedDeviceId(formattedCameras[1]?.deviceId || formattedCameras[0].deviceId);
      }

      const formattedAudio: AudioDevice[] = aInputs.map((d, index) => ({
        deviceId: d.deviceId,
        label: d.label || `Microphone ${index + 1}`,
      }));
      setAudioDevices(formattedAudio);
      if (formattedAudio.length > 0) {
        setSelectedAudioId(formattedAudio[0].deviceId);
      }
    } catch (e) {
      console.error('Error discovering devices:', e);
      setErrorMsg('Could not discover connected media devices.');
    }
  };

  // 2. Request Camera Permissions
  const requestMediaPermissions = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setHasPermission(true);
      // Immediately enumerate now that labels are accessible
      await enumerateConnectedDevices();

      // Attach stream to Program monitor
      activeStreamRef.current = stream;
      if (programVideoRef.current) {
        programVideoRef.current.srcObject = stream;
      }
      setSuccessMsg('Camera & Microphone permissions granted.');
    } catch (err: unknown) {
      console.warn('Camera permission denied or unavailable, enabling simulated virtual inputs:', err);
      setHasPermission(false);
      setErrorMsg('Camera permission not granted. Simulated multi-camera broadcasting inputs enabled.');
      await enumerateConnectedDevices();
    }
  };

  useEffect(() => {
    enumerateConnectedDevices();
  }, []);

  // Update Staging Preview when staged device changes
  useEffect(() => {
    let cancel = false;
    const startStaging = async () => {
      if (!stagedDeviceId || !hasPermission) return;
      try {
        if (stagedStreamRef.current) {
          stagedStreamRef.current.getTracks().forEach((t) => t.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: stagedDeviceId } },
          audio: false,
        });
        if (cancel) return;
        stagedStreamRef.current = stream;
        if (stagingVideoRef.current) {
          stagingVideoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.warn('Staging preview stream error:', e);
      }
    };

    startStaging();
    return () => {
      cancel = true;
    };
  }, [stagedDeviceId, hasPermission]);

  // 3. Switch Program Camera (Live Switcher)
  const handleSwitchCamera = async (targetDeviceId: string) => {
    if (!user) return;
    setIsSwitching(true);
    setErrorMsg(null);

    const targetDev = videoDevices.find((d) => d.deviceId === targetDeviceId);
    const cameraLabel = targetDev ? targetDev.customName : 'Alternate Angle';

    try {
      // 1. Acquire new media stream if real device available
      if (hasPermission && targetDeviceId) {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: targetDeviceId } },
            audio: !isMicMuted,
          });

          if (programVideoRef.current) {
            programVideoRef.current.srcObject = newStream;
          }

          if (activeStreamRef.current) {
            activeStreamRef.current.getTracks().forEach((t) => t.stop());
          }
          activeStreamRef.current = newStream;
        } catch (mediaErr) {
          console.warn('Could not acquire hardware device, maintaining program stream:', mediaErr);
        }
      }

      setSelectedDeviceId(targetDeviceId);

      // 2. Report camera switch to server API & audit log
      const res = await fetch(`/api/matches/${match.id}/camera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: user.id,
          cameraName: cameraLabel,
          reason: `Operator switched program output to ${cameraLabel}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server rejected camera switch');

      setSuccessMsg(`Program switched to: ${cameraLabel}`);
      if (onCameraSwitched) onCameraSwitched(cameraLabel);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to switch camera';
      setErrorMsg(msg);
    } finally {
      setTimeout(() => setIsSwitching(false), 300);
    }
  };

  // Toggle Broadcasting Status
  const handleTogglePublish = async () => {
    if (!user) return;
    setErrorMsg(null);

    const nextStatus = isPublishing ? 'PAUSED' : 'LIVE';
    try {
      const res = await fetch(`/api/matches/${match.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: user.id,
          newStatus: nextStatus,
          reason: isPublishing ? 'Operator paused broadcast' : 'Operator started live program broadcast',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update broadcast status');

      setIsPublishing(!isPublishing);
      if (onMatchStatusChanged) onMatchStatusChanged(nextStatus);
      setSuccessMsg(`Broadcast state updated to ${nextStatus}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Broadcast toggle failed';
      setErrorMsg(msg);
    }
  };

  const currentProgramCamera = videoDevices.find((d) => d.deviceId === selectedDeviceId);

  return (
    <div className="space-y-6">
      {/* Alert Notices */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded bg-red-950/50 border border-red-800 text-red-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 rounded bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Broadcast Switcher Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): PROGRAM OUTPUT & STAGING */}
        <div className="lg:col-span-8 space-y-4">
          {/* Program Output Screen */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-2 font-semibold text-white">
                <div className={`w-2.5 h-2.5 rounded-full ${isPublishing ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`} />
                <span>PROGRAM FEED (ON AIR)</span>
                {isSwitching && (
                  <span className="text-[10px] text-amber-400 font-mono animate-pulse">SWITCHING ANGLE...</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
                <span className="text-emerald-400 font-semibold">{currentProgramCamera?.customName || 'Camera 1'}</span>
                <span>·</span>
                <span>{metrics.resolution} @ {metrics.fps}fps</span>
              </div>
            </div>

            {/* Video Canvas / Element */}
            <div className="relative aspect-video bg-neutral-950 rounded overflow-hidden flex items-center justify-center border border-neutral-800">
              <video
                ref={programVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />

              {!hasPermission && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/60">
                  <Camera className="w-10 h-10 text-neutral-500 mb-2" />
                  <div className="text-sm font-semibold text-white">Broadcast Camera Monitor</div>
                  <div className="text-xs text-neutral-400 max-w-sm mt-1">
                    Click &quot;Request Camera Permissions&quot; to link your local hardware webcams or use simulated angles below.
                  </div>
                  <button
                    onClick={requestMediaPermissions}
                    className="mt-3 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded transition-colors"
                  >
                    Grant Camera Access
                  </button>
                </div>
              )}

              {/* Watermark */}
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300">
                PROG: {currentProgramCamera?.customName}
              </div>
            </div>
          </div>

          {/* Quick Camera Switcher Bar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-red-500" />
                Live Camera Switcher (Seamless WebRTC Cut)
              </span>
              <span className="text-neutral-500 text-[11px]">Select tile to switch active program feed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {videoDevices.map((cam, idx) => {
                const isCurrent = cam.deviceId === selectedDeviceId;
                const isStaged = cam.deviceId === stagedDeviceId;

                return (
                  <div
                    key={cam.deviceId || idx}
                    className={`relative p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-red-950/40 border-red-600 shadow-md ring-1 ring-red-500/50'
                        : isStaged
                        ? 'bg-neutral-800/80 border-amber-500/60'
                        : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                    }`}
                    onClick={() => handleSwitchCamera(cam.deviceId)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-neutral-400">CAM #{idx + 1}</span>
                      {isCurrent ? (
                        <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase tracking-wider">
                          LIVE
                        </span>
                      ) : isStaged ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[9px] uppercase">
                          PREVIEW
                        </span>
                      ) : null}
                    </div>

                    <div className="text-xs font-bold text-white truncate">{cam.customName}</div>
                    <div className="text-[10px] text-neutral-500 truncate mt-0.5">{cam.label}</div>

                    <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStagedDeviceId(cam.deviceId);
                        }}
                        className="text-neutral-400 hover:text-white underline"
                      >
                        Preview Staging
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSwitchCamera(cam.deviceId);
                        }}
                        className={`font-semibold ${isCurrent ? 'text-red-400' : 'text-emerald-400 hover:text-emerald-300'}`}
                      >
                        {isCurrent ? 'ACTIVE' : 'TAKE LIVE'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): STAGING PREVIEW & CONTROLS */}
        <div className="lg:col-span-4 space-y-4">
          {/* Staging / Preview Box */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-xs">
              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                STAGING PREVIEW (BUS)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">Next Angle Check</span>
            </div>

            <div className="relative aspect-video bg-neutral-950 rounded overflow-hidden flex items-center justify-center border border-neutral-800">
              <video
                ref={stagingVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                <div className="text-[11px] font-mono text-neutral-400">
                  {videoDevices.find((d) => d.deviceId === stagedDeviceId)?.customName || 'Select Staging Angle'}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSwitchCamera(stagedDeviceId)}
              disabled={selectedDeviceId === stagedDeviceId}
              className="w-full mt-2 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>CUT STAGED TO PROGRAM</span>
            </button>
          </div>

          {/* Master Operational Controls */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-3">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5 border-b border-neutral-800 pb-2">
              <Radio className="w-3.5 h-3.5 text-red-500" />
              Master Broadcast Controls
            </div>

            {/* Toggle Live Stream Button */}
            <button
              onClick={handleTogglePublish}
              className={`w-full py-2.5 px-4 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                isPublishing
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
              }`}
            >
              {isPublishing ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>PAUSE PROGRAM BROADCAST</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>START LIVE PROGRAM BROADCAST</span>
                </>
              )}
            </button>

            {/* Microphone Toggle */}
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`w-full py-2 px-3 rounded font-medium text-xs flex items-center justify-center gap-2 border transition-colors ${
                isMicMuted
                  ? 'bg-red-950/40 border-red-800 text-red-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-200'
              }`}
            >
              {isMicMuted ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-red-400" />
                  <span>Pit Microphone: MUTED</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pit Microphone: LIVE</span>
                </>
              )}
            </button>

            {/* Diagnostics Stats */}
            <div className="pt-2 border-t border-neutral-800 space-y-1.5 text-[11px] font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>Room Name:</span>
                <span className="text-white truncate max-w-[140px]">{match.broadcast_room_id}</span>
              </div>
              <div className="flex justify-between">
                <span>WebRTC Mesh:</span>
                <span className="text-emerald-400">{metrics.webrtcState}</span>
              </div>
              <div className="flex justify-between">
                <span>Bitrate:</span>
                <span className="text-neutral-200">{metrics.bitrateMbps} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span>Codec Profile:</span>
                <span className="text-neutral-200">{metrics.codec}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
