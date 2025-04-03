const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./s3module').s3;
const constants = require('./constants');
const { v4: uuidv4 } = require('uuid');

const bucket = `the${process.env.MODE}-store`;
const allowedTypes = ['jpg', 'jpeg', 'png', 'pdf'];

function getFileExtension(mimetype) {
  if (!mimetype) return 'bin';
  if (mimetype.includes('jpeg')) return 'jpg';
  if (mimetype.includes('png')) return 'png';
  if (mimetype.includes('pdf')) return 'pdf';
  return 'bin';
}

function makeUploader(folderResolver) {
    return multer({
        limits: { files: 1 },
      storage: multerS3({
        s3,
        bucket,
        key: (req, file, callback) => {
          try {
            console.log('✅ [multer] 파일 도착:', file); // 파일 정보 출력
            console.log('📦 [multer] req.body:', req.body); // body 데이터 확인
            console.log('📁 [multer] 폴더:', folderResolver(req)); // 폴더 경로 확인
  
            const extension = getFileExtension(file.mimetype);
            const uuid = uuidv4();
            const folder = folderResolver(req);
            const filename = `${folder}/${uuid}.${extension}`;
  
            console.log('📝 [multer] 최종 파일명:', filename);
  
            callback(null, filename);
          } catch (err) {
            console.error('❌ 파일 업로드 중 에러:', err);
            callback(err);
          }
        },
      }),
    });
  }

const upload = {
  // 회원가입용
  join: makeUploader(() => constants.s3Directory.join),

  // 일반 첨부파일용
  attachment: makeUploader(() => constants.s3Directory.attachment),

  // 게시물 관련 첨부파일
  postImage: makeUploader((req) => {
    const postId = req.body.postId || 'default'; // 없으면 fallback
    return `${constants.s3Directory.postImages}/${postId}`;
  }),
};

module.exports = upload;