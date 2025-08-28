import {
	deleteDownloadedAsset,
	downloadStream,
	getDownloadedAssets,
	getDownloadsStatus,
	registerPlugin,
	useEvent,
	type DownloadStatus,
	type DownloadedAsset,
} from '@TheWidlarzGroup/react-native-video-stream-downloader';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Video from 'react-native-video';

// Replace with your API key from https://www.thewidlarzgroup.com/offline-video-sdk
const API_KEY = '30b90ce3-62c8-4a46-a0ae-311eb4e77026';

export default function MainVideoExample() {
	const [downloads, setDownloads] = useState<DownloadStatus[]>([]);
	const [assets, setAssets] = useState<DownloadedAsset[]>([]);
	const [currentVideoUri, setCurrentVideoUri] = useState<string | null>(null);

	const videoUrl =
		'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
	const videoName = 'Big Buck Bunny';
	const videoThumb =
		'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg';
	const videoDesc =
		'Big Buck Bunny is a short computer-animated comedy film by the Blender Institute, featuring a giant rabbit and his woodland friends.';

	// Listen for SDK download progress and end events at the top level
	useEvent('onDownloadProgress', async () => {
		await refreshData();
	});
	useEvent('onDownloadEnd', async () => {
		await refreshData();
	});

	useEffect(() => {
		const initializeSDK = async () => {
			try {
				await registerPlugin(API_KEY);
				await refreshData();
			} catch (error) {
				console.error('Error initializing SDK:', error);
			}
		};
		initializeSDK();
	}, []);

	const refreshData = async () => {
		try {
			const [downloadStatuses, downloadedAssets] = await Promise.all([
				getDownloadsStatus(),
				getDownloadedAssets(),
			]);
			setDownloads(downloadStatuses);
			setAssets(downloadedAssets);
		} catch (error) {
			console.error('Error refreshing data:', error);
		}
	};

	const startDownload = async () => {
		try {
			const status = await downloadStream(videoUrl);
			if (!status || !status.id) {
				throw new Error('No download started');
			}
			await refreshData();
		} catch (error) {
			console.error('Error starting download:', error);
			Alert.alert(
				'Download Error',
				'Failed to start download. Please check your connection and try again.'
			);
		}
	};

	const deleteDownload = async () => {
		try {
			const asset = assets.find((a) => a.url === videoUrl);
			if (asset) {
				await deleteDownloadedAsset(asset.id);
				setCurrentVideoUri(null);
				setDownloads((prev) => prev.filter((d) => d.url !== videoUrl));
				setAssets((prev) => prev.filter((a) => a.url !== videoUrl));
				await refreshData();
			}
		} catch (error) {
			console.error('Error deleting download:', error);
			Alert.alert('Delete Error', 'Failed to delete downloaded video');
		}
	};

	const playOffline = () => {
		const asset = assets.find((a) => a.url === videoUrl);
		if (asset?.pathToFile) {
			setCurrentVideoUri(asset.pathToFile);
		} else {
			Alert.alert('Not available', 'Please download the video first.');
		}
	};

	// No online play

	const isDownloaded = assets.some((a) => a.url === videoUrl);
	const downloadInProgress = downloads.some(
		(d) => d.url === videoUrl && d.status !== 'completed'
	);
	const downloadStatus = downloads.find(
		(d) => d.url === videoUrl && d.status !== 'completed'
	);

	return (
		<View style={styles.bg}>
			<View style={styles.centeredCard}>
				<Image
					source={{ uri: videoThumb }}
					style={styles.thumbnail}
					resizeMode="cover"
				/>
				<Text style={styles.title}>{videoName}</Text>
				<Text style={styles.desc}>{videoDesc}</Text>
				<View style={styles.videoContainer}>
					{isDownloaded && currentVideoUri ? (
						<Video
							source={{ uri: currentVideoUri }}
							style={styles.video}
							controls
							resizeMode="contain"
						/>
					) : (
						<View style={styles.videoPlaceholder}>
							<Text style={styles.status}>
								Download the video to play offline.
							</Text>
						</View>
					)}
				</View>
				<View style={styles.controls}>
					{isDownloaded ? (
						<>
							<TouchableOpacity style={styles.playButton} onPress={playOffline}>
								<Text style={styles.playButtonText}>▶ Play</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.deleteButton}
								onPress={deleteDownload}
							>
								<Text style={styles.deleteButtonText}>Delete</Text>
							</TouchableOpacity>
						</>
					) : (
						<TouchableOpacity
							style={[
								styles.downloadButton,
								downloadInProgress && styles.disabledButton,
							]}
							onPress={startDownload}
							disabled={downloadInProgress}
						>
							<Text style={styles.downloadButtonText}>
								{downloadInProgress && downloadStatus
									? `Downloading ${Math.round(
											(downloadStatus.progress || 0) * 100
									  )}%`
									: '⬇ Download'}
							</Text>
						</TouchableOpacity>
					)}
				</View>
				<Text style={styles.status}>
					{isDownloaded
						? 'Ready to play offline'
						: downloadInProgress && downloadStatus
						? `Downloading ${Math.round(
								(downloadStatus.progress || 0) * 100
						  )}%...`
						: 'Not downloaded'}
				</Text>
			</View>
		</View>
	);
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	bg: {
		flex: 1,
		backgroundColor: '#181818',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 0,
	},
	centeredCard: {
		backgroundColor: '#232323',
		borderRadius: 18,
		padding: 24,
		width: width > 400 ? 400 : width - 32,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 4 },
		elevation: 8,
	},
	thumbnail: {
		width: '100%',
		height: 180,
		borderRadius: 12,
		marginBottom: 18,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 8,
		textAlign: 'center',
	},
	desc: {
		color: '#b3b3b3',
		fontSize: 15,
		marginBottom: 18,
		textAlign: 'center',
	},
	videoContainer: {
		width: '100%',
		alignItems: 'center',
		marginBottom: 18,
	},
	video: {
		width: '100%',
		height: 180,
		backgroundColor: '#000',
		borderRadius: 12,
	},
	videoPlaceholder: {
		width: '100%',
		height: 180,
		backgroundColor: '#222',
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	controls: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 12,
		marginBottom: 18,
	},
	playButton: {
		backgroundColor: '#e50914',
		borderRadius: 6,
		paddingHorizontal: 28,
		paddingVertical: 12,
		marginRight: 8,
	},
	playButtonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
		letterSpacing: 1,
	},
	downloadButton: {
		backgroundColor: '#fff',
		borderRadius: 6,
		paddingHorizontal: 28,
		paddingVertical: 12,
		marginRight: 8,
	},
	downloadButtonText: {
		color: '#181818',
		fontWeight: 'bold',
		fontSize: 16,
		letterSpacing: 1,
	},
	deleteButton: {
		backgroundColor: '#444',
		borderRadius: 6,
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	deleteButtonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
		letterSpacing: 1,
	},
	disabledButton: {
		backgroundColor: '#999',
	},
	status: {
		fontSize: 15,
		color: '#b3b3b3',
		textAlign: 'center',
		marginBottom: 0,
	},
});
