import { Typography, Box, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

interface StorageEstimate {
  quota?: number;
  usage?: number;
}

interface StorageInfo {
  total: number | null;
  used: number | null;
  available: number | null;
}

function StorageInfoComponent() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    total: null,
    used: null,
    available: null,
  });

  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number | null): string => {
    if (bytes === null) return 'N/A';
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  useEffect(() => {
    async function getStorageInfo() {
      try {
        if (!navigator.storage?.estimate) {
          throw new Error('Storage Estimation API not available');
        }

        const storage = await navigator.storage.estimate() as StorageEstimate;

        if (storage.quota === undefined || storage.usage === undefined) {
          throw new Error('Could not retrieve storage information');
        }

        setStorageInfo({
          total: storage.quota,
          used: storage.usage,
          available: storage.quota - storage.usage,
        });
      } catch (error) {
        console.error("Error estimating storage:", error);
        setError(error instanceof Error ? error.message : 'Failed to get storage information');
      }
    }

    getStorageInfo();
  }, []);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Storage Information
      </Typography>
      
      {error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : (
        <Box>
          <Typography variant="body2">
            Total: {formatBytes(storageInfo.total)}
          </Typography>
          <Typography variant="body2">
            Used: {formatBytes(storageInfo.used)}
          </Typography>
          <Typography variant="body2">
            Available: {formatBytes(storageInfo.available)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default StorageInfoComponent;