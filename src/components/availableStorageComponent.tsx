import { Typography, Box, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

function StorageInfoComponent() {
  const [storageInfo, setStorageInfo] = useState({
    total: 0,
    used: 0,
    available: 0,
  });

  useEffect(() => {
    async function getStorageInfo() {
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const storage = await navigator.storage.estimate({
            quota: 1024 * 1024 * 1024, // Example: 1GB
            usage: 1024 * 1024 * 1024,
          });
          setStorageInfo({
            total: storage.quota,
            used: storage.usage,
            available: storage.quota - storage.usage,
          });
        } catch (error) {
          console.error("Error estimating storage:", error);
        }
      }
    }
    getStorageInfo();
  }, []);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Storage Information
      </Typography>
      <Box>
        <Typography variant="body2">
          Total: {storageInfo.total} bytes
        </Typography>
        <Typography variant="body2">
          Used: {storageInfo.used} bytes
        </Typography>
        <Typography variant="body2">
          Available: {storageInfo.available} bytes
        </Typography>
      </Box>
    </Paper>
  );
}

export default StorageInfoComponent;