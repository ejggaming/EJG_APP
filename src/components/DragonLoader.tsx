export default function DragonLoader() {
  return (
    <>
      <style>{`
        @keyframes horseFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-16px) translateX(6px) scale(1.04); }
        }
        @keyframes horseGlow {
          0%, 100% { filter: drop-shadow(0 0 10px #f59e0b) drop-shadow(0 0 25px #dc262660); }
          50% { filter: drop-shadow(0 0 22px #f59e0b) drop-shadow(0 0 50px #dc2626aa) drop-shadow(0 0 80px #f59e0b44); }
        }
        @keyframes hoofStamp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes maneFlow {
          0%, 100% { transform: skewX(0deg); opacity: 0.85; }
          50% { transform: skewX(4deg); opacity: 1; }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ringRotateReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes particle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) translateX(var(--tx)) scale(0); opacity: 0; }
        }
        @keyframes shimmerText {
          0% { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes lanternSway {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes lanternGlow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0) translateY(0); opacity: 0.12; }
          50% { transform: translateX(18px) translateY(-8px); opacity: 0.22; }
          100% { transform: translateX(0) translateY(0); opacity: 0.12; }
        }
        @keyframes eyeGlow {
          0%, 100% { filter: drop-shadow(0 0 4px #f59e0b); }
          50% { filter: drop-shadow(0 0 12px #f59e0b) drop-shadow(0 0 20px #ffffff88); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .horse-wrap {
          animation: horseFloat 3.5s ease-in-out infinite, horseGlow 2.5s ease-in-out infinite;
        }
        .mane-flow { animation: maneFlow 1.2s ease-in-out infinite; transform-origin: left center; }
        .hoof-stamp { animation: hoofStamp 0.8s ease-in-out infinite; transform-origin: top center; }
        .ring-outer { animation: ringRotate 12s linear infinite; transform-origin: center; }
        .ring-inner { animation: ringRotateReverse 8s linear infinite; transform-origin: center; }
        .eye-glow { animation: eyeGlow 2s ease-in-out infinite; }
        .load-wrap { animation: fadeIn 0.6s ease-out both; }
      `}</style>

      {/* ── Full-screen backdrop ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background:
            "radial-gradient(ellipse at 50% 45%, #4a0000 0%, #1c0000 55%, #050000 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* ── Background cloud wisps ── */}
        {[
          { x: "12%", y: "18%", s: 1.0, d: "0s" },
          { x: "80%", y: "22%", s: 0.8, d: "1.2s" },
          { x: "25%", y: "75%", s: 1.2, d: "0.6s" },
          { x: "70%", y: "70%", s: 0.9, d: "1.8s" },
          { x: "50%", y: "88%", s: 0.7, d: "0.9s" },
        ].map((c, i) => (
          <svg
            key={i}
            viewBox="0 0 120 50"
            width={90 * c.s}
            height={38 * c.s}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              transform: "translate(-50%,-50%)",
              opacity: 0.15,
              animation: `cloudDrift ${4 + i * 0.7}s ease-in-out ${c.d} infinite`,
            }}
          >
            <path
              d="M10,35 Q5,20 20,20 Q18,8 35,10 Q40,2 55,8 Q65,0 78,10 Q92,5 95,20 Q108,18 108,30 Q108,40 95,40 Q85,45 60,42 Q40,45 25,40 Q8,42 10,35Z"
              fill="#dc2626"
            />
          </svg>
        ))}

        {/* ── Corner lanterns ── */}
        {[
          { x: "5%", y: "3%", flip: false },
          { x: "95%", y: "3%", flip: true },
        ].map((l, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: l.x,
              top: l.y,
              transform: l.flip ? "translateX(-100%)" : undefined,
              animation: `lanternSway ${2.8 + i * 0.4}s ease-in-out ${i * 0.5}s infinite`,
              transformOrigin: "top center",
            }}
          >
            <svg viewBox="0 0 60 120" width={48} height={96}>
              {/* String */}
              <line x1="30" y1="0" x2="30" y2="14" stroke="#cc0000" strokeWidth="2" />
              {/* Top cap */}
              <ellipse cx="30" cy="16" rx="14" ry="5" fill="#8b0000" />
              {/* Body */}
              <ellipse cx="30" cy="55" rx="22" ry="40" fill="#dc2626"
                style={{ animation: `lanternGlow 2s ease-in-out ${i * 0.3}s infinite` }} />
              {/* Inner glow */}
              <ellipse cx="30" cy="52" rx="13" ry="25" fill="#ff8800" opacity="0.35"
                style={{ animation: `lanternGlow 1.8s ease-in-out ${i * 0.2}s infinite` }} />
              {/* Gold ribs */}
              {[-18, -9, 0, 9, 18].map((dy, j) => (
                <ellipse key={j} cx="30" cy={55 + dy} rx="22" ry="2" fill="none"
                  stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />
              ))}
              {/* Bottom cap */}
              <ellipse cx="30" cy="94" rx="14" ry="5" fill="#8b0000" />
              {/* Tassel */}
              {[-6, 0, 6].map((dx, j) => (
                <line key={j} x1={30 + dx} y1="99" x2={30 + dx} y2="116"
                  stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              ))}
              {/* Horse character on lantern */}
              <text x="30" y="60" textAnchor="middle" fontSize="18" fill="#ffcc00"
                fontWeight="bold" fontFamily="serif">馬</text>
            </svg>
          </div>
        ))}

        {/* ── Particle sparks ── */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const tx = Math.round(Math.sin(angle) * 40);
          const delay = (i * 0.18).toFixed(2) + "s";
          const dur = (1.4 + (i % 4) * 0.25).toFixed(2) + "s";
          const size = 4 + (i % 3) * 3;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                background: i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#ff4400" : "#ffcc00",
                top: "calc(50% - 40px)",
                left: "calc(50% + " + (tx * 0.5) + "px)",
                // @ts-ignore
                "--tx": tx + "px",
                animation: `particle ${dur} ease-out ${delay} infinite`,
                boxShadow: `0 0 ${size + 2}px currentColor`,
              } as React.CSSProperties}
            />
          );
        })}

        {/* ── Main horse medallion ── */}
        <div className="load-wrap" style={{ position: "relative" }}>
          {/* Outer rotating ring */}
          <div className="ring-outer" style={{ position: "absolute", inset: -20 }}>
            <svg viewBox="0 0 340 340" width={340} height={340}>
              <circle cx="170" cy="170" r="163" fill="none"
                stroke="#8b0000" strokeWidth="3" />
              <circle cx="170" cy="170" r="158" fill="none"
                stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="8 6" />
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
                const r = 163;
                const x = 170 + Math.cos(a) * r;
                const y = 170 + Math.sin(a) * r;
                return (
                  <polygon key={i}
                    points={`${x},${y - 5} ${x + 4},${y} ${x},${y + 5} ${x - 4},${y}`}
                    fill={i % 8 === 0 ? "#f59e0b" : "#8b0000"}
                    opacity={i % 8 === 0 ? 1 : 0.5}
                    transform={`rotate(${(i / 24) * 360} ${x} ${y})`}
                  />
                );
              })}
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const x1 = 170 + Math.cos(a) * 148;
                const y1 = 170 + Math.sin(a) * 148;
                const x2 = 170 + Math.cos(a) * 135;
                const y2 = 170 + Math.sin(a) * 135;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#f59e0b" strokeWidth="2.5" />
                    {[0, 4, 8].map((off) => {
                      const bx = 170 + Math.cos(a) * 125;
                      const by = 170 + Math.sin(a) * 125;
                      const na = a + Math.PI / 2;
                      const hx = 8;
                      return (
                        <line key={off}
                          x1={bx + Math.cos(na) * hx - Math.cos(a) * (off - 4)}
                          y1={by + Math.sin(na) * hx - Math.sin(a) * (off - 4)}
                          x2={bx - Math.cos(na) * hx - Math.cos(a) * (off - 4)}
                          y2={by - Math.sin(na) * hx - Math.sin(a) * (off - 4)}
                          stroke="#f59e0b" strokeWidth="1.5" opacity="0.6"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Inner rotating ring */}
          <div className="ring-inner" style={{ position: "absolute", inset: -20 }}>
            <svg viewBox="0 0 340 340" width={340} height={340}>
              <circle cx="170" cy="170" r="148" fill="none"
                stroke="#8b0000" strokeWidth="1" />
              {Array.from({ length: 48 }).map((_, i) => {
                const a = (i / 48) * Math.PI * 2;
                const x = 170 + Math.cos(a) * 148;
                const y = 170 + Math.sin(a) * 148;
                return (
                  <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 2.5 : 1}
                    fill={i % 4 === 0 ? "#f59e0b" : "#cc0000"} opacity="0.7" />
                );
              })}
            </svg>
          </div>

          {/* Horse center circle */}
          <div
            className="horse-wrap"
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at 40% 35%, #3d0000 0%, #1a0000 60%, #0a0000 100%)",
              border: "3px solid #8b0000",
              boxShadow: "inset 0 0 40px #00000088, 0 0 30px #8b000066",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* THE HORSE SVG */}
            <svg
              viewBox="0 0 585.07 585.07"
              width={230}
              height={230}
              style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 0 12px #f59e0b88)", transform: "scaleX(-1) rotate(-14deg)", transformOrigin: "center" }}
            >
              <defs>
                <radialGradient id="horseBody" cx="45%" cy="38%">
                  <stop offset="0%" stopColor="#ff4444" />
                  <stop offset="55%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#7a0000" />
                </radialGradient>
              </defs>
              <path
                fill="url(#horseBody)"
                d="M516.665,268.961c-2.612-2.081-5.633-6.307-7.075-9.321c-15.941-33.423-61.555-43.061-104.987-41.012 c-46.5,2.19-104.438,10.713-112.958,3.408c-7.731-6.629,6.192-1.623,21.754-12.117c2.772-1.871,2.134-3.174-1.188-2.76 c-10.941,1.348-34.277,2.379-47.605-10.678c-2.397-2.334-5.55-6.838-6.644-9.998c-5.902-17.031,22.219-21.462,23.162-4.775 c0.189,3.333,0.57,3.57,1.519,0.363c2.349-7.923,3.638-22.015-14.127-27.479c-22.068-6.792-41.357-4.702-49.334-14.854 c-2.063-2.627-0.195-4.459,3.044-3.632c12.856,3.298,45.025,8.766,75.681-8.334c2.914-1.629,2.583-2.358-0.686-1.67 c-14.118,2.984-50.596,7.554-74.712-17.522c-22.455-23.351-42.386-16.488-51.293-11.281c-2.894,1.688-7.09,1.821-9.824-0.097 c-4.679-3.287-12.386-8.329-21.536-12.903c0,0-14.786-5.843-19.901-24.837c-5.113-18.985-10.042-3.467-9.49,4.936 c0.301,4.678,0.78,10.719,1.138,15.149c0.272,3.328-1.217,8.128-3.584,10.489c-2.885,2.887-6.783,6.244-9.975,7.039 c-5.84,1.457-12.049,4.2-15.155,14.423s-21.911,20.082-31.401,24.647c-9.49,4.563-27.208,17.709-23.738,25.378 c3.467,7.669-5.296,16.976,10.961,21.548c16.252,4.563,17.709,1.64,20.995-4.933c2.973-5.946,17.741-0.541,34.853-7.149 c3.121-1.206,8.145-1.876,11.47-1.525c4.321,0.458,10.27,0.538,15.397-1.368c9.31-3.47,4.38,5.479,4.38,10.402 c0,4.395,1.02,48.078,3.567,67.616c0.428,3.316-0.364,8.311-1.865,11.299c-6.324,12.625-19.999,45.238-7.746,71.062 c1.434,3.02,0.603,6.655-2.396,8.115c-7.985,3.895-24.042,10.456-42.129,10.799c-25.807,0.484-31.897,16.556-33.112,22.645 c-1.218,6.088-29.702,41.269-28.236,53.682c1.339,11.359-12.619,18.441-13.878,38.869c-0.207,3.333,2.675,5.609,5.902,4.729 c9.005-2.465,25.136-8.825,25.136-22.78c0-19.353-1.46-15.155,6.573-28.845c7.572-12.903,13.196-40.069,44.36-43.32 c3.322-0.343,8.686,0.267,11.972,0.869c4.188,0.769,9.847,1.655,14.357,1.844c3.339,0.143,4.4,1.727,2.923,4.729 c-1.889,3.843-3.839,9.387-3.251,15.097c0.346,3.321,3.88,7.247,6.646,9.12c8.473,5.745,25.561,18.205,35.261,31.428 c1.98,2.695,5.527,6.839,8.851,7.205c2.837,0.308,7.02,0.106,13.084-1.412c15.338-3.83,17.159,2.926,18.625,4.562 c1.46,1.644,10.406-4.93,23.915-3.646c0,0,6.204,0-4.383-9.31c-8.033-7.063-10.495-13.808-15.599-15.936 c-3.085-1.288-8.715-0.313-11.801,0.981c-3.821,1.596-3.724,3.995-6.011,8.57c-3.106,6.206-8.402-2.193-11.136-4.386 c-2.743-2.187-32.323-15.882-30.313-29.938c2.01-14.062,20.998-1.1,51.492-8.948c17.31-4.463,27.677-6.266,33.411-6.999 c3.316-0.419,8.733-0.65,12.079-0.75c8.698-0.248,24.272-0.166,29.557,3.186c7.081,4.492,74.425,4.569,106.574-12.731 c2.938-1.591,5.166-0.438,5.415,2.896c0.401,5.533,1.442,13.377,4.138,16.959c3.806,5.077,1.135,28.75-10.043,35.836 c-2.819,1.797-8.357,2.205-11.686,2.584c-15.144,1.708-40.223,5.579-50.152,11.686c-2.855,1.749-6.325,5.828-8.973,7.867 c-8.065,6.212-23.543,19.729-26.327,33.874c-0.641,3.28,2.341,6.224,5.678,6.283c5.139,0.101,12.69-0.077,19.204-1.46 c3.266-0.697,6.563-4.332,7.947-7.377c3.611-7.949,12.176-21.775,28.873-24.477c19.299-3.114,40.654-6.472,51.489-9.587 c3.216-0.916,6.597,0.461,7.282,3.729c0.887,4.197,1.524,9.978,0.023,14.99c-2.73,9.126-18.258,34.69-37.787,45.648 c-15.203,8.518-24.648,15.049-27.497,21.828c-1.301,3.08,1.867,6.372,5.184,6.745c8.263,0.928,22.827,1.749,29.063-2.825 c1.956-1.442,3.339-2.66,4.297-3.688c2.146-2.288,0.987-6.916,1.667-9.239c0.401-1.371,1.33-2.411,3.345-1.867 c4.747,1.276,6.939,2.736,9.683-3.647c2.742-6.396,31.947-38.349,43.639-44.556c11.686-6.212,10.409-18.808,5.846-32.503 c-4.568-13.689-7.488-43.272,8.21-53.132c15.705-9.859,42.18-36.15,52.949-50.756c5.798-7.861,15.562-14.563,21.408-25.227 c1.614-2.932,3.878-3.168,5.421-0.201c12.737,24.5,18.908,55.312,0.213,69.244c-24.914,18.566-11.438,37.563-3.476,45.649 c2.347,2.382,2.831,1.874,1.253-1.07c-11.142-20.747,13.382-25.026,17.626-14.581c3.439,8.481-3.057,31.51-6.461,42.32 c-0.999,3.187,0.538,4.434,2.867,2.039c3.41-3.505,5.976-8.062,7.643-11.608c1.412-3.026,1.654-2.955,1.105,0.343 c-5.385,32.09,7.229,51.932,14.191,60.106c2.163,2.548,3.446,1.726,2.92-1.572c-5.609-35.163,30.653-53.628,30.659-120.621 C585.047,331.677,545.533,291.977,516.665,268.961z"
              />
            </svg>
          </div>
        </div>

        {/* ── App title ── */}
        <div style={{ marginTop: 36, textAlign: "center" }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              fontFamily: "serif",
              letterSpacing: "0.08em",
              background: "linear-gradient(90deg, #cc0000 0%, #f59e0b 30%, #ffee44 50%, #f59e0b 70%, #cc0000 100%)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmerText 2.5s linear infinite",
            }}
          >
            JUETENG
          </div>
          <div style={{
            fontSize: 11,
            letterSpacing: "0.35em",
            color: "#8b0000",
            marginTop: 4,
            textTransform: "uppercase",
          }}>
            ── Lucky Numbers ──
          </div>
        </div>

        {/* ── Loading dots ── */}
        <div style={{ marginTop: 28, display: "flex", gap: 10, alignItems: "center" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: i === 2 ? 12 : 8,
                height: i === 2 ? 12 : 8,
                borderRadius: "50%",
                background: i % 2 === 0 ? "#dc2626" : "#f59e0b",
                animation: `dotBounce 1.2s ease-in-out ${(i * 0.15).toFixed(2)}s infinite`,
                boxShadow: i === 2 ? "0 0 10px #f59e0b" : "none",
              }}
            />
          ))}
        </div>


      </div>
    </>
  );
}
