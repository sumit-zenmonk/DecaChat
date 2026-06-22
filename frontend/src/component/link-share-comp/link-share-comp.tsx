import { Box, Dialog, Typography } from '@mui/material';
import styles from './link-share-comp.module.css';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon
} from 'react-share';

interface Props {
    open: boolean;
    onClose: () => void;
    data: { shareUrl: string, title: string }
}

export default function LinkShareComp({ open, onClose, data }: Props) {
    const shareUrl = data.shareUrl;
    const title = data.title;

    const handlePick = () => {
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Share Room Link
                </Typography>

                <Typography className={styles.subHeading}>
                    Social links
                </Typography>
            </Box>

            <Box className={styles.socialWrapper}>
                {/* Facebook */}
                <FacebookShareButton url={shareUrl} hashtag="#reactjs" onClick={handlePick} className={styles.socialButton}>
                    <FacebookIcon size={40} round={true} />
                </FacebookShareButton>

                {/* X / Twitter */}
                <TwitterShareButton url={shareUrl} title={title} onClick={handlePick} className={styles.socialButton}>
                    <TwitterIcon size={40} round={true} />
                </TwitterShareButton>

                {/* LinkedIn */}
                <LinkedinShareButton url={shareUrl} title={title} onClick={handlePick} className={styles.socialButton}>
                    <LinkedinIcon size={40} round={true} />
                </LinkedinShareButton>

                {/* WhatsApp */}
                <WhatsappShareButton url={shareUrl} title={title} separator=":: " onClick={handlePick} className={styles.socialButton}>
                    <WhatsappIcon size={40} round={true} />
                </WhatsappShareButton>
            </Box>
        </Dialog>
    );
};
