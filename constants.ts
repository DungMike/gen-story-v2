import { StoryTemplate } from './types';

export const templates: StoryTemplate[] = [
  {
    id: "an-mang-tam-linh",
    name: "Án mạng tâm linh",
    description:
      "Một câu chuyện rùng rợn về những vụ án bí ẩn liên quan đến thế giới tâm linh.",
    gradient: "from-purple-500 to-indigo-600",
    chapters: {
      1: "Chương 1: Giới thiệu bối cảnh và nhân vật chính",
      2: "Chương 2: Phát hiện bất ngờ",
      3: "Chương 3: Đi sâu vào quá khứ và những bí mật được che giấu",
      4: "Chương 4: Tình huống đột ngột thay đổi",
      5: "Chương 5: Câu chuyện tiếp cận đỉnh điểm",
      6: "Chương 6: Kết thúc bất ngờ và mở ra một bí ẩn mới",
    },
    fields: [
      // Chương 1
      {
        id: "chuong1_boiduc_chinh",
        label: "Bối cảnh chính",
        type: "select",
        options: [
          "Ngôi làng",
          "Ngôi chùa cổ",
          "Bệnh viện bỏ hoang",
          "Địa điểm hẻo lánh",
          "Tòa lâu đài",
        ],
        chapter: 1,
        description: "Chọn một bối cảnh cho câu chuyện của bạn",
      },
      {
        id: "chuong1_mota_boiduc",
        label: "Mô tả bối cảnh",
        type: "textarea",
        placeholder:
          "Một ngôi làng yên bình, tĩnh lặng, nhưng có một cảm giác u ám nặng nề",
        chapter: 1,
        description: "Miêu tả chi tiết về bối cảnh",
      },
      {
        id: "chuong1_ten_nhanvat",
        label: "Tên nhân vật chính",
        type: "text",
        placeholder: "Minh, Lan, Hòa, Tú, Thảo...",
        chapter: 1,
        description: "Tên của nhân vật chính trong câu chuyện",
      },
      {
        id: "chuong1_mota_nhanvat",
        label: "Mô tả nhân vật chính",
        type: "textarea",
        placeholder:
          "Một thám tử tài ba, một đứa trẻ mồ côi, một người có quá khứ bí ẩn",
        chapter: 1,
        description: "Miêu tả tính cách và đặc điểm của nhân vật chính",
      },
      {
        id: "chuong1_sukien_khoidau",
        label: "Sự kiện khởi đầu",
        type: "select",
        options: [
          "Phát hiện một cái chết bí ẩn",
          "Một tiếng chuông chùa vang lên kỳ lạ",
          "Một người mất tích",
          "Một hiện tượng siêu nhiên",
        ],
        chapter: 1,
        description: "Sự kiện khiến câu chuyện bắt đầu",
      },

      // Chương 2
      {
        id: "chuong2_phathien_kyla",
        label: "Chi tiết phát hiện",
        type: "select",
        options: [
          "Một thi thể bị giấu trong một ngôi mộ",
          "Một vật phẩm cổ xưa bị nguyền rủa",
          "Một bức thư lạ",
          "Một chiếc vòng cổ có chữ kỳ lạ",
        ],
        chapter: 2,
        description: "Mô tả sự kiện bất ngờ mà nhân vật chính phát hiện",
      },
      {
        id: "chuong2_nguoi_phathien",
        label: "Người phát hiện",
        type: "select",
        options: [
          "Nhân vật chính",
          "Sư cô Diệu An",
          "Cảnh sát Hà",
          "Người dân trong làng",
        ],
        chapter: 2,
        description: "Ai là người đầu tiên phát hiện ra sự kiện này",
      },
      {
        id: "chuong2_camxuc",
        label: "Cảm xúc nhân vật chính",
        type: "select",
        options: ["Sự hoảng sợ", "Sự kinh ngạc", "Sự lo lắng", "Sự tò mò"],
        chapter: 2,
        description:
          "Miêu tả cảm xúc của nhân vật chính khi phát hiện ra điều kỳ lạ",
      },

      // Chương 3
      {
        id: "chuong3_bimat_lichsu",
        label: "Bí mật lịch sử",
        type: "select",
        options: [
          "Một vụ án chưa được giải quyết từ 20 năm trước",
          "Một nghi lễ kỳ lạ",
          "Một sự kiện bị giấu kín về một người thân",
        ],
        chapter: 3,
        description: "Bí mật mà nhân vật chính khám phá trong quá khứ",
      },
      {
        id: "chuong3_nhanvat_quakhu",
        label: "Nhân vật liên quan đến quá khứ",
        type: "select",
        options: [
          "Sư Thích Chí Định",
          "Bà Năm Chắt",
          "Một người mất tích trong quá khứ",
        ],
        chapter: 3,
        description:
          "Người có mối quan hệ đặc biệt hoặc có liên quan đến quá khứ",
      },
      {
        id: "chuong3_manh_moi",
        label: "Manh mối mới",
        type: "select",
        options: [
          "Một bức ảnh cũ",
          "Một chiếc vòng tay",
          "Một sổ ghi chép cổ",
          "Một đoạn băng cũ",
        ],
        chapter: 3,
        description: "Manh mối mà nhân vật chính tìm thấy",
      },

      // Chương 4
      {
        id: "chuong4_cai_chet",
        label: "Cái chết bất ngờ",
        type: "select",
        options: [
          "Một người bạn thân",
          "Một nhân vật phụ quan trọng",
          "Một người lạ",
        ],
        chapter: 4,
        description: "Ai là người chết làm thay đổi câu chuyện",
      },
      {
        id: "chuong4_nghi_ngo",
        label: "Người bị nghi ngờ",
        type: "select",
        options: ["Thầy tu", "Cảnh sát", "Bạn thân", "Người dân trong làng"],
        chapter: 4,
        description: "Ai là người bị nghi ngờ?",
      },
      {
        id: "chuong4_bimat_moi",
        label: "Bí ẩn mới được phát hiện",
        type: "select",
        options: [
          "Một chiếc hộp gỗ với ghi chép kỳ lạ",
          "Một đoạn băng ghi lại cuộc trò chuyện",
          "Một chứng cứ bị che giấu trong một vật phẩm",
        ],
        chapter: 4,
        description:
          "Chi tiết mới được khám phá thay đổi hướng đi của câu chuyện",
      },

      // Chương 5
      {
        id: "chuong5_su_that",
        label: "Sự thật lớn",
        type: "select",
        options: [
          "Kẻ sát nhân là người bạn thân nhất",
          "Lý do sát nhân có liên quan đến một vụ việc trong quá khứ",
          "Một nghi lễ tâm linh sai lầm",
        ],
        chapter: 5,
        description: "Sự thật về kẻ sát nhân hoặc lý do đằng sau các sự kiện",
      },
      {
        id: "chuong5_ly_do_tra_thu",
        label: "Lý do trả thù",
        type: "select",
        options: [
          "Thù hận kéo dài nhiều năm",
          "Lỗi lầm của gia đình",
          "Sự trả thù vì tình yêu",
        ],
        chapter: 5,
        description: "Động lực đằng sau hành vi trả thù",
      },

      // Chương 6
      {
        id: "chuong6_twist_cuoi",
        label: "Cú twist cuối cùng",
        type: "select",
        options: [
          "Một nhân vật tưởng đã chết xuất hiện",
          "Một chứng cứ mới khiến vụ án không khép lại",
          "Một mối quan hệ không ai ngờ đến",
        ],
        chapter: 6,
        description: "Chi tiết bất ngờ làm thay đổi hướng câu chuyện",
      },
      {
        id: "chuong6_cau_hoi_mo",
        label: "Câu hỏi mở",
        type: "select",
        options: [
          "Liệu kẻ sát nhân thật sự đã chết?",
          "Ai mới là người thực sự giật dây?",
          "Những linh hồn có được siêu thoát?",
        ],
        chapter: 6,
        description: "Câu hỏi để lại cho người đọc suy ngẫm",
      },
    ],
  },
  {
    id: "kinh-di-hoc-duong",
    name: "Kinh dị học đường",
    description:
      "Câu chuyện kinh dị diễn ra trong môi trường học đường với những bí ẩn đáng sợ.",
    gradient: "from-red-500 to-pink-600",
    chapters: {
      1: "Chương 1: Môi trường học đường",
      2: "Chương 2: Những dấu hiệu kỳ lạ",
      3: "Chương 3: Bí mật của ngôi trường",
      4: "Chương 4: Cuộc điều tra",
      5: "Chương 5: Sự thật kinh hoàng",
      6: "Chương 6: Kết thúc và hệ lụy",
    },
    fields: [
      {
        id: "kd_truong_hoc",
        label: "Loại trường học",
        type: "select",
        options: [
          "Trường cấp 3 cũ",
          "Trường đại học",
          "Trường nội trú",
          "Trường tư thục",
        ],
        chapter: 1,
        description: "Chọn loại trường học làm bối cảnh",
      },
      {
        id: "kd_nhan_vat_chinh",
        label: "Nhân vật chính",
        type: "text",
        placeholder: "Tên học sinh/sinh viên",
        chapter: 1,
        description: "Tên của nhân vật chính",
      },
    ],
  },
  {
    id: "gia-tuong-phieu-luu",
    name: "Giả tưởng phiêu lưu",
    description:
      "Cuộc phiêu lưu trong thế giới giả tưởng với phép thuật và những sinh vật kỳ diệu.",
    gradient: "from-blue-500 to-cyan-600",
    chapters: {
      1: "Chương 1: Thế giới mới",
      2: "Chương 2: Cuộc hành trình",
      3: "Chương 3: Thử thách đầu tiên",
      4: "Chương 4: Đồng minh và kẻ thù",
      5: "Chương 5: Trận chiến cuối cùng",
      6: "Chương 6: Kết thúc và khởi đầu mới",
    },
    fields: [
      {
        id: "gt_the_gioi",
        label: "Thế giới giả tưởng",
        type: "select",
        options: [
          "Vương quốc phép thuật",
          "Thế giới rồng",
          "Xứ sở thần tiên",
          "Hành tinh xa xôi",
        ],
        chapter: 1,
        description: "Chọn thế giới giả tưởng",
      },
      {
        id: "gt_nhan_vat",
        label: "Nhân vật chính",
        type: "text",
        placeholder: "Tên anh hùng",
        chapter: 1,
        description: "Tên của nhân vật chính",
      },
    ],
  },
];

export const STORY_TEMPLATES: StoryTemplate[] = templates;
