export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
export const STYLE_PROMPT_1 = `
Phong cách kể chuyện:
1.	Giọng văn:
    o	Nghiêm túc, trang trọng: Sử dụng từ ngữ chuẩn mực, mang tính tường thuật của báo chí điều tra, thời sự.
    o	Kịch tính, lôi cuốn: Mở đầu bằng những câu hỏi gợi sự tò mò, những chi tiết "lạnh gáy", "không lời trăn trối nhưng để lại quá nhiều câu hỏi".
    o	Khách quan nhưng có cảm xúc: Tường thuật sự việc một cách chi tiết, dựa trên bằng chứng, nhưng vẫn lồng ghép những nhận định mang tính cảnh báo, suy ngẫm ở cuối truyện.
    o	Chuyên nghiệp: Sử dụng nhiều thuật ngữ chuyên ngành của công an, điều tra, pháp y (ví dụ: "đội trọng án", "phòng cảnh sát hình sự", "hiện trường được phong tỏa", "khám nghiệm tử thi", "vật chứng", "tổ trinh sát", "kỹ thuật hình sự", "pháp y", "giám định ADN", "tố tụng", "khởi tố", "viện kiểm sát").
2.	Tiết tấu:
    o	Nhanh ở đoạn mở đầu: Nhanh chóng giới thiệu vụ án, nạn nhân và những điểm bí ẩn ban đầu để thu hút ngay lập tức.
    o	Chậm rãi, chi tiết ở đoạn điều tra: Tường thuật tỉ mỉ quá trình khám nghiệm hiện trường, thu thập chứng cứ, lấy lời khai, phân tích dữ liệu. Mỗi tình tiết mới được đưa ra một cách có trình tự, logic.
    o	Đẩy cao trào ở những "nút thắt": Khi phát hiện những tình tiết quan trọng (bao tay, vết son, dữ liệu camera mâu thuẫn, sự xuất hiện của người chị song sinh).
    o	Giải quyết nhanh ở đoạn kết luận điều tra và xét xử: Khi hung thủ đã lộ diện, lời khai được trình bày, và bản án được tuyên.
    o	Lắng đọng ở phần kết: Chuyển sang suy ngẫm, đưa ra bài học, thông điệp.
3.	Phong cách kể chuyện:
    o	Tường thuật theo trình tự thời gian: Bắt đầu từ khi phát hiện vụ án, quá trình điều tra, cho đến khi xét xử và kết thúc bằng những suy ngẫm.
    o	Đan xen giữa sự kiện và phân tích: Không chỉ kể lại sự việc mà còn lồng ghép những suy luận của cơ quan điều tra, chuyên gia tâm lý tội phạm.
    o	Sử dụng nhiều chi tiết cụ thể: Ngày, giờ, địa điểm, đặc điểm nhận dạng, vật chứng được mô tả rõ ràng.
    o	Tạo bất ngờ (plot twist): Sự xuất hiện của người chị song sinh là một yếu tố bất ngờ lớn, thay đổi hướng điều tra.
    o	Dẫn dắt người đọc/nghe theo dòng suy luận của điều tra viên: Từng bước hé lộ manh mối, loại trừ nghi phạm, cho đến khi tìm ra hung thủ thật sự.
    o	Kết thúc bằng một thông điệp mang tính xã hội: Không chỉ là một vụ án hình sự đơn thuần mà còn là bài học về mối quan hệ, sự quan tâm, lắng nghe.
4.	Từ ngữ đặc trưng:
    o	Các cụm từ như: "Xin chào quý vị khán giả", "mới đây tại Hà Nội", "vậy thì rốt cuộc chuyện gì đã xảy ra", "lực lượng chức năng", "hiện trường lập tức được phong tỏa", "kết luận tử vong sơ bộ", "cán bộ điều tra tiến hành già soát", "tuy nhiên", "điều này khẳng định", "một tình tiết đáng chú ý", "dưới sức ép tâm lý", "mở ra một hướng điều tra mới", "những chi tiết nhỏ nhưng nhất quán", "bắt đầu từ đây một giả thiết mới được đặt ra", "cú sốc đầu tiên", "sự mâu thuẫn buộc tổ điều tra", "chính thức cúi đầu nhận tội", "theo lời khai", "bản án chưa tuyên nhưng sự thật đã rõ", "tòa tuyên", "vụ án khép lại... nhưng...", "câu hỏi nhức nhối".
5.  Sử dụng lối viết "Tả" thay vì "Kể" (Show, don't tell). Ví dụ: thay vì nói "Dũng cảm thấy sợ hãi", hãy miêu tả "Hơi thở của Dũng trở nên gấp gáp, mồ hôi lạnh túa ra sau gáy."
    o	Tránh lặp lại thông tin đã có ở các chương trước.
    o	Tạo ra một tình huống căng thẳng (cliffhanger) ở cuối chương. Ví dụ: Dũng tìm ra một sự thật mới nhưng bị kẻ bí ẩn phát hiện, hoặc anh ta nhận ra nạn nhân tiếp theo có thể là ai.
6.	Tuyệt đối không lặp lại bất kỳ đoạn văn nào đã được viết. Mỗi câu chữ đều phải mới và phục vụ cho việc phát triển câu chuyện.
`