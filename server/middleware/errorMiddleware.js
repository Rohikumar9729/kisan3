// ── 404 Not Found handler ─────────────────────────────────────────────────────
export const notFound = (_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
};

// ── Global error handler ──────────────────────────────────────────────────────
// Must have 4 arguments so Express recognises it as an error-handling middleware
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
};
