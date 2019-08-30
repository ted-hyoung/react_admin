// base
import React from 'react';

// assets
import iconYoutube from 'assets/images/template/icon-youtube.png';
import iconInstagram from 'assets/images/template/icon-instagram.png';
import iconMenu from 'assets/images/template/icon-menu.png';
import iconLogo from 'assets/images/template/icon-logo.png';
import iconHeartOn from 'assets/images/template/icon-heart-on.png';
import iconPlay from 'assets/images/template/icon-play.png';
import iconImage from 'assets/images/template/icon-image.png';
import iconQuestion from 'assets/images/template/icon-qna-question.png';
import iconAnswer from 'assets/images/template/icon-qna-answer.png';
import iconAnswerWait from 'assets/images/template/icon-answer-wait.png';
import iconAnswerComplete from 'assets/images/template/icon-answer-complete.png';
import iconLine from 'assets/images/template/icon-line.png';
import iconSharing from 'assets/images/template/icon-sharing.png';
import iconSharingClose from 'assets/images/template/icon-sharing-close.png';
import iconKaKaoTalkSharing from 'assets/images/template/icon-kakaotalk.png';
import iconKaKaoStorySharing from 'assets/images/template/icon-kakaostory.png';
import iconUrlCopySharing from 'assets/images/template/icon-url.png';
import iconFaceBookSharing from 'assets/images/template/icon-facebook.png';
import iconBadSharing from 'assets/images/template/icon-band.png';
import iconNaverBlogSharing from 'assets/images/template/icon-naver-blog.png';
import iconOrderFinish from 'assets/images/template/icon-order-finish.png';
import iconPaymentComplete from 'assets/images/template/icon-payment-complete.png';
import iconPaymentCancel from 'assets/images/template/icon-payment-cancel.png';
import iconReceipt from 'assets/images/template/icon-receipt.png';
import iconShippingInProgress from 'assets/images/template/icon-shipping-in-progress.png';
import iconShippingComplete from 'assets/images/template/icon-shipping-complete.png';
import iconClose from 'assets/images/template/icon-close.png';
import iconHome from 'assets/images/template/icon-home.png';
import iconPen from 'assets/images/template/icon-pen.png';
import iconHeadset from 'assets/images/template/icon-headset.png';
import iconCamera from 'assets/images/template/icon-camera.png';
import iconLogout from 'assets/images/template/icon-logout.png';
import iconLogin from 'assets/images/template/icon-login.png';
import iconPhone from 'assets/images/template/icon-phone.png';
import iconLock from 'assets/images/template/icon-lock.png';
import iconExclamationMark from 'assets/images/template/icon-exclamation-mark.png';

export function YoutubeIcon() {
  return <img src={iconYoutube} alt="Youtube" />;
}

export function InstagramIcon() {
  return <img src={iconInstagram} alt="Instagram" />;
}

export function MenuIcon() {
  return <img src={iconMenu} alt="Menu" />;
}

export function LogoIcon() {
  return <img src={iconLogo} alt="Menu" />;
}

export function HeartOnIcon() {
  return <img src={iconHeartOn} alt="Heart" />;
}

export function HeartTopIcon() {
  return <img src={iconHeartOn} alt="Heart" style={{ width: 16, height: 16 }} />;
}

export function PlayIcon() {
  return <img src={iconPlay} alt="Play" />;
}

export function QuesionIcon() {
  return <img src={iconQuestion} alt="질문" />;
}

export function AnswerIcon() {
  return <img src={iconAnswer} alt="답변" />;
}

export function AnswerWaitIcon() {
  return <img src={iconAnswerWait} alt="답변대기" />;
}

export function AnswerCompleteIcon() {
  return <img src={iconAnswerComplete} alt="답변완료" />;
}

export function ImageIcon() {
  return <img src={iconImage} alt="Image" />;
}

export function HeartOnOffIcon() {
  // todo : 추후에 상태값에 따라 return image 분기처리가 필요함
  return <img src={iconHeartOn} alt="Heart" />;
}

export function LineIcon() {
  return <img src={iconLine} alt="Line" />;
}

export function SharingIcon() {
  return <img src={iconSharing} alt="Sharing" />;
}

export function SharingCloseIcon() {
  return <img src={iconSharingClose} alt="SharingClose" />;
}

export function SharingKaKaoTalkIcon() {
  return <img src={iconKaKaoTalkSharing} alt="SharingKaKaoTalk" />;
}

export function SharingKaKaoStoryIcon() {
  return <img src={iconKaKaoStorySharing} alt="SharingKaKaoStory" />;
}

export function SharingCopyUrlIcon() {
  return <img src={iconUrlCopySharing} alt="SharingUrl" />;
}

export function SharingFaceBookIcon() {
  return <img src={iconFaceBookSharing} alt="SharingFaceBook" />;
}

export function SharingBandIcon() {
  return <img src={iconBadSharing} alt="SharingBand" />;
}

export function SharingNaverBlogIcon() {
  return <img src={iconNaverBlogSharing} alt="SharingNaverBlog" />;
}

export function OrderFinishIcon() {
  return <img src={iconOrderFinish} alt="주문 완료" />;
}

export function PaymentCompleteIcon() {
  return <img src={iconPaymentComplete} alt="결제완료" />;
}

export function PaymentCancelIcon() {
  return <img src={iconPaymentCancel} alt="결제 취소" />;
}

export function ReceiptIcon() {
  return <img src={iconReceipt} alt="영수증" />;
}

export function ShippingInProgressIcon() {
  return <img src={iconShippingInProgress} alt="배송중" />;
}

export function ShippingCompleteIcon() {
  return <img src={iconShippingComplete} alt="배송완료" />;
}

export function GageIcon({ percentage, fill }: { percentage: number; fill: string }) {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="106" height="34">
        <defs>
          <filter id="a" width="22" height="21" x="92" y="20" filterUnits="userSpaceOnUse">
            <feOffset dy="1" in="SourceAlpha" />
            <feGaussianBlur result="blurOut" stdDeviation="2.236" />
            <feFlood floodColor="#000C26" result="floodOut" />
            <feComposite in="floodOut" in2="blurOut" operator="atop" />
            <feComponentTransfer>
              <feFuncA slope=".4" type="linear" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          fill={fill}
          fillRule="evenodd"
          d="M100.88 34.001c-1.281 0-2.438-.488-3.336-1.266a54.499 54.499 0 0 0-1.324-1.757C86.164 18.156 70.549 9.909 53 9.909c-17.552 0-33.169 8.25-43.225 21.076-.45.573-.889 1.155-1.316 1.746-.899.781-2.057 1.27-3.34 1.27a5.124 5.124 0 0 1-5.121-5.126c0-.644.132-1.254.349-1.822a63.962 63.962 0 0 1 1.69-2.247C13.907 9.707 32.315-.001 53-.001c20.687 0 39.096 9.71 50.966 24.811a64.41 64.41 0 0 1 1.684 2.238c.218.569.351 1.181.351 1.827a5.124 5.124 0 0 1-5.121 5.126z"
        />
        <path
          fill="#FFF"
          fillRule="evenodd"
          d="M107.261 23.897l1.233 1.575-11.025 8.629-1.232-1.575 11.024-8.629z"
          filter="url(#a)"
        />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="69" height="69" style={{ overflow: 'visible' }}>
        <path
          fill={fill}
          fillRule="evenodd"
          d="M65.135 18.639A34.34 34.34 0 0 1 69 34.5C69 53.554 53.554 69 34.5 69 15.446 69 0 53.554 0 34.5 0 15.446 15.446 0 34.5 0c10.446 0 19.8 4.649 26.127 11.983L68 11l-2.865 7.639z"
          transform={`rotate(${percentage < 100 ? percentage - 100 : 0}, 34.5, 34.5)`}
        />
        <text x="13" y="30" fill="white" style={{ fontWeight: 700 }}>
          목표액
        </text>
        <text x="20" y="50" fill="white" style={{ fontWeight: 700 }}>
          달성
        </text>
      </svg>
    </>
  );
}

export function CloseIcon() {
  return <img src={iconClose} alt="닫기" />;
}

export function HomeIcon() {
  return <img src={iconHome} alt="메인으로" />;
}

export function PenIcon() {
  return <img src={iconPen} alt="주문 내역" />;
}

export function HeadsetIcon() {
  return <img src={iconHeadset} alt="1:1 문의" />;
}

export function CameraIcon() {
  return <img src={iconCamera} alt="나의 후기" />;
}

export function LogoutIcon() {
  return <img src={iconLogout} alt="로그아웃" />;
}

export function LoginIcon() {
  return <img src={iconLogin} alt="로그인 아이디" />;
}

export function PhoneIcon() {
  return <img src={iconPhone} alt="휴대전화 번호" />;
}

export function LockIcon() {
  return <img src={iconLock} alt="찾을 수 없는 페이지" />;
}

export function ExclamationMarkIcon() {
  return <img src={iconExclamationMark} alt="서비스 점검중" />;
}
