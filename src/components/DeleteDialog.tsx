
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface DeleteDialog {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    userId: string | undefined;
}

const DeleteDialog: React.FC<DeleteDialog> = ({ open, onClose }) => {

    const handleDelete = async () => {
        
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="disconnect-device-dialog-title"
            aria-describedby="disconnect-device-dialog-description"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: 'var(--background-primary)',
                        color: 'var(--text-primary)',
                    },
                },
            }}
        >
            <DialogTitle id="disconnect-device-dialog-title">
                Delete file
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="disconnect-device-dialog-description"
                    sx={{ color: 'var(--text-primary)' }}
                >
                    Are you sure you want to delete pad (pad number)?

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: '#F28E32' }}>Cancel</Button>
                <Button
                    onClick={handleDelete}
                    sx={{ color: '#F28E32' }}

                >
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
