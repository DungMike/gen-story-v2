import { GoogleGenAI } from '@google/genai';
// Note: wav module is for Node.js, will use browser APIs instead

if (!process.env.GEMINI_API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface TTSProgress {
  current: number;
  total: number;
  currentChunk: string;
  status: 'processing' | 'completed' | 'error';
}

// Helper function to create downloadable audio blob
function createAudioBlob(audioBuffer: ArrayBuffer): Blob {
  return new Blob([audioBuffer], { type: 'audio/wav' });
}

// Helper function to download blob as file
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to split text into chunks of maximum word count
function splitTextIntoChunks(text: string, maxWords = 1500): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += maxWords) {
    const chunk = words.slice(i, i + maxWords).join(' ');
    chunks.push(chunk);
  }
  
  return chunks;
}

// Function to convert single chunk to speech
async function convertChunkToSpeech(
  text: string,
  chunkIndex: number,
  totalChunks: number,
  onProgress?: (progress: TTSProgress) => void
): Promise<{blob: Blob, filename: string, url: string}> {
  try {
    onProgress?.({
      current: chunkIndex + 1,
      total: totalChunks,
      currentChunk: text.substring(0, 100) + '...',
      status: 'processing'
    });

    const prompt = `Hãy đọc đoạn văn bản sau bằng giọng đọc tự nhiên, rõ ràng và có cảm xúc phù hợp với nội dung:

${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
            voiceConfig: {
               prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
         },
      }
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!data) {
      throw new Error(`No audio data received for chunk ${chunkIndex + 1}`);
    }

    // Convert base64 to ArrayBuffer
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const audioBlob = createAudioBlob(bytes.buffer);
    const fileName = `story_chunk_${chunkIndex + 1}.wav`;
    
    // Return the blob URL and filename for download
    return {
      blob: audioBlob,
      filename: fileName,
      url: URL.createObjectURL(audioBlob)
    };
  } catch (error) {
    console.error(`Error converting chunk ${chunkIndex + 1} to speech:`, error);
    throw error;
  }
}

// Main function to convert full text to speech
export async function convertTextToSpeech(
  text: string,
  onProgress?: (progress: TTSProgress) => void
): Promise<Array<{blob: Blob, filename: string, url: string}>> {
  try {
    const text= "Xin chào quý vị khán giả! Mới đây tại thị trấn Sương Mù, mộtXin chào quý vị khán giả! Mới đây tại thị trấn Sương Mù, một địa danh hẻo lánh nép mình giữa trùng điệp núi non và quanh năm phủ sương, sự yên bình vốn có đã bị xé toạc bởi một cái chết bí ẩn, lạnh gáy. Nơi đây, địa danh hẻo lánh nép mình giữa trùng điệp núi non và quanh năm phủ sương, sự yên bình vốn có đã bị xé toạc bởi một cái chết bí ẩn, lạnh gáy. Nơi đây, những lời đồn đại ma quái vẫn thường âm ỉ, giờ đây như được tiếp thêm sinh lực, gieo rắc nỗi sợ hãi tột cùng.\n\nVào một buổi sáng mờ sương, người dân những lời đồn đại ma quái vẫn thường âm ỉ, giờ đây như được tiếp thêm sinh lực, gieo rắc nỗi sợ hãi tột cùng.\n\nVào một buổi sáng mờ sương, người dân làng bàng hoàng phát hiện thi thể ông Lương, một người đàn ông sống cô độc, nằm chết trong căn nhà khóa trái. Không có dấu hiệu đột nhập, không vật lộn, nhưng vẻ mặt ông Lương đông cứng trong làng bàng hoàng phát hiện thi thể ông Lương, một người đàn ông sống cô độc, nằm chết trong căn nhà khóa trái. Không có dấu hiệu đột nhập, không vật lộn, nhưng vẻ mặt ông Lương đông cứng trong nỗi kinh hoàng cùng cực, như thể vừa đối diện với một thứ gì đó siêu nhiên, vượt quá khả năng lý giải của con người. Vậy thì rốt cuộc chuyện gì đã xảy ra?\n\nĐể giải mã vụ án này, Th nỗi kinh hoàng cùng cực, như thể vừa đối diện với một thứ gì đó siêu nhiên, vượt quá khả năng lý giải của con người. Vậy thì rốt cuộc chuyện gì đã xảy ra?\n\nĐể giải mã vụ án này, Thám tử Kiên đã được điều đến. Là một điều tra viên tài ba với lý trí sắc bén, Kiên luôn tin vào khoa học và bằng chứng cụ thể. Tuy nhiên, trước không khí u ám, nặng nề cùngám tử Kiên đã được điều đến. Là một điều tra viên tài ba với lý trí sắc bén, Kiên luôn tin vào khoa học và bằng chứng cụ thể. Tuy nhiên, trước không khí u ám, nặng nề cùng vô số lời đồn ma quỷ bao trùm Sương Mù, ngay cả một người hoài nghi như Kiên cũng không khỏi cảm thấy lạnh sống lưng. Cái chết bí ẩn của ông Lương, không lời trăn trối nhưng vô số lời đồn ma quỷ bao trùm Sương Mù, ngay cả một người hoài nghi như Kiên cũng không khỏi cảm thấy lạnh sống lưng. Cái chết bí ẩn của ông Lương, không lời trăn trối nhưng để lại quá nhiều câu hỏi, đã đẩy Kiên vào một cuộc chiến cam go giữa lý trí và những thế lực tâm linh huyền bí. để lại quá nhiều câu hỏi, đã đẩy Kiên vào một cuộc chiến cam go giữa lý trí và những thế lực tâm linh huyền bí.Sau cái chết bí ẩn của ông Lương, Thám tử Kiên, với sự hoài nghi cố hữu về những điều huyền bí, vẫn quyết tâm tìm kiếm manh mối dựa trên khoa học. Anh cẩnSau cái chết bí ẩn của ông Lương, Thám tử Kiên, với sự hoài nghi cố hữu về những điều huyền bí, vẫn quyết tâm tìm kiếm manh mối dựa trên khoa học. Anh cẩn trọng rà soát khu vực xung quanh căn nhà, đặc biệt chú ý đến những vạt rừng thưa thớt phía sau, nơi những lời đồn đại ma quái thường ám ảnh. Trong màn sương mịt mờ trọng rà soát khu vực xung quanh căn nhà, đặc biệt chú ý đến những vạt rừng thưa thớt phía sau, nơi những lời đồn đại ma quái thường ám ảnh. Trong màn sương mịt mờ đặc trưng của Sương Mù, Kiên bất ngờ vấp phải một gò đất nhỏ, được ngụy trang sơ sài bằng lá khô và cành cây. Một linh tính mạnh mẽ thôi thúc, anh thận trọng g đặc trưng của Sương Mù, Kiên bất ngờ vấp phải một gò đất nhỏ, được ngụy trang sơ sài bằng lá khô và cành cây. Một linh tính mạnh mẽ thôi thúc, anh thận trọng gạt bỏ lớp che phủ. Cảnh tượng kinh hoàng lập tức đập vào mắt Kiên: một hố chôn sơ sài, bên trong lộ rõ một phần thi thể người. Khuôn mặt Thám tử Kiên,ạt bỏ lớp che phủ. Cảnh tượng kinh hoàng lập tức đập vào mắt Kiên: một hố chôn sơ sài, bên trong lộ rõ một phần thi thể người. Khuôn mặt Thám tử Kiên, vốn luôn điềm tĩnh, giờ đây cứng đờ vì một nỗi hoảng sợ tột độ. Điều này khẳng định rằng vụ án không chỉ dừng lại ở cái chết của ông Lương; một bí mật kinh hoàng hơn đã được vốn luôn điềm tĩnh, giờ đây cứng đờ vì một nỗi hoảng sợ tột độ. Điều này khẳng định rằng vụ án không chỉ dừng lại ở cái chết của ông Lương; một bí mật kinh hoàng hơn đã được chôn giấu, và cuộc chiến giữa lý trí của anh và những thế lực tâm linh dường như chỉ vừa mới bắt đầu. chôn giấu, và cuộc chiến giữa lý trí của anh và những thế lực tâm linh dường như chỉ vừa mới bắt đầu.Thám tử Kiên, dù làThám tử Kiên, dù là người duy lý, không khỏi rùng mình trước xác chết vừa phát lộ. Lực lượng chức năng nhanh chóng có mặt, phong tỏa hiện trường. Kết quả khám nghiệm sơ bộ của phòng kỹ thuật hình sự cho thấy thi thể đã bị chôn v người duy lý, không khỏi rùng mình trước xác chết vừa phát lộ. Lực lượng chức năng nhanh chóng có mặt, phong tỏa hiện trường. Kết quả khám nghiệm sơ bộ của phòng kỹ thuật hình sự cho thấy thi thể đã bị chôn vùi ít nhất hai thập kỷ, một chi tiết kinh hoàng kéo theo một vụ án chưa được giải quyết từ 20 năm trước, từng bị thời gian và sương mù che lấp.\n\nTrong quá trình thu thập lời khai từ những ngườiùi ít nhất hai thập kỷ, một chi tiết kinh hoàng kéo theo một vụ án chưa được giải quyết từ 20 năm trước, từng bị thời gian và sương mù che lấp.\n\nTrong quá trình thu thập lời khai từ những người dân cố cựu tại Sương Mù, tên Sư Thích Chí Định, vị cao tăng ẩn cư trên núi, liên tục được nhắc đến với vẻ đầy kiêng dè và bí ẩn. Dường như ông biết nhiều hơn dân cố cựu tại Sương Mù, tên Sư Thích Chí Định, vị cao tăng ẩn cư trên núi, liên tục được nhắc đến với vẻ đầy kiêng dè và bí ẩn. Dường như ông biết nhiều hơn những gì ông nói về những bí mật của thị trấn.\n\nKiên quyết định tìm đến Sư Thích Chí Định. Tại ngôi am nhỏ mục nát, giữa mùi nhang trầm và không khí u tịch, Sư Định đưa cho những gì ông nói về những bí mật của thị trấn.\n\nKiên quyết định tìm đến Sư Thích Chí Định. Tại ngôi am nhỏ mục nát, giữa mùi nhang trầm và không khí u tịch, Sư Định đưa cho Kiên một bức ảnh cũ đã ố vàng. Bức ảnh chụp một nhóm người trẻ tuổi, trong đó có một người phụ nữ với ánh mắt khắc khoải, và đáng chú ý, một khuôn mặt trẻ hơn của ông L Kiên một bức ảnh cũ đã ố vàng. Bức ảnh chụp một nhóm người trẻ tuổi, trong đó có một người phụ nữ với ánh mắt khắc khoải, và đáng chú ý, một khuôn mặt trẻ hơn của ông Lương. Manh mối này mở ra một cánh cửa tăm tối dẫn về quá khứ đầy ám ảnh, một chuỗi sự kiện mà thị trấn Sương Mù đã cố che giấu suốt bao năm qua.ương. Manh mối này mở ra một cánh cửa tăm tối dẫn về quá khứ đầy ám ảnh, một chuỗi sự kiện mà thị trấn Sương Mù đã cố che giấu suốt bao năm qua.Mới đây tại Sương Mù, một biến cố kinh hoàng tiếp tục giáng xuống khi ông Thắng, người bạn thân chí cốt của nạn nhân Lương, được phát hiện tử vong tại nhà riêng. Ông Thắng làMới đây tại Sương Mù, một biến cố kinh hoàng tiếp tục giáng xuống khi ông Thắng, người bạn thân chí cốt của nạn nhân Lương, được phát hiện tử vong tại nhà riêng. Ông Thắng là một trong những người cuối cùng còn sống sót trong bức ảnh ố vàng Sư Định đã đưa cho Kiên. Hiện trường không có dấu hiệu xô xát, song ánh mắt ông Thắng đông cứng lại vẻ sợ hãi t một trong những người cuối cùng còn sống sót trong bức ảnh ố vàng Sư Định đã đưa cho Kiên. Hiện trường không có dấu hiệu xô xát, song ánh mắt ông Thắng đông cứng lại vẻ sợ hãi tột độ, hệt như nạn nhân Lương trước đó.\n\nVụ án này ngay lập tức khiến Sư Thích Chí Định trở thành đối tượng nghi vấn hàng đầu. Những lời đồn đại về khả năng tâm linh vàột độ, hệt như nạn nhân Lương trước đó.\n\nVụ án này ngay lập tức khiến Sư Thích Chí Định trở thành đối tượng nghi vấn hàng đầu. Những lời đồn đại về khả năng tâm linh và quá khứ bí ẩn của ông ta càng được thổi bùng. Trong quá trình rà soát kỹ lưỡng căn nhà ông Thắng, lực lượng chức năng đã phát hiện một tình tiết đáng chú ý: một chiếc hộp gỗ cũ quá khứ bí ẩn của ông ta càng được thổi bùng. Trong quá trình rà soát kỹ lưỡng căn nhà ông Thắng, lực lượng chức năng đã phát hiện một tình tiết đáng chú ý: một chiếc hộp gỗ cũ kỹ giấu dưới lớp ván sàn. Bên trong là những ghi chép nguệch ngoạc bằng ngôn ngữ cổ xưa cùng các biểu tượng kỳ lạ, gợi liên tưởng đến nghi lễ tâm linh. Điều này khẳng định, vụ kỹ giấu dưới lớp ván sàn. Bên trong là những ghi chép nguệch ngoạc bằng ngôn ngữ cổ xưa cùng các biểu tượng kỳ lạ, gợi liên tưởng đến nghi lễ tâm linh. Điều này khẳng định, vụ án không chỉ đơn thuần là giết người, mà còn ẩn chứa bí mật vượt quá sự hiểu biết thông thường, mở ra một hướng điều tra mới. án không chỉ đơn thuần là giết người, mà còn ẩn chứa bí mật vượt quá sự hiểu biết thông thường, mở ra một hướng điều tra mới.Cuộc điều tra về cái chết của ông Lương và ông ThCuộc điều tra về cái chết của ông Lương và ông Thắng bước vào giai đoạn quyết định. Phòng Kỹ thuật hình sự và các chuyên gia ngôn ngữ cổ đã dốc toàn lực phân tích những ghi chú và biểu tượng kỳ lạ được tìm thấy dưới sàn nhà ông Thắng. Từngắng bước vào giai đoạn quyết định. Phòng Kỹ thuật hình sự và các chuyên gia ngôn ngữ cổ đã dốc toàn lực phân tích những ghi chú và biểu tượng kỳ lạ được tìm thấy dưới sàn nhà ông Thắng. Từng nét chữ, từng ký hiệu, dù đã phai mờ theo thời gian, dần hé lộ một bí mật kinh hoàng. Điều này khẳng định vụ án không chỉ đơn thuần là giết người, mà là chuỗi báo thù dai nét chữ, từng ký hiệu, dù đã phai mờ theo thời gian, dần hé lộ một bí mật kinh hoàng. Điều này khẳng định vụ án không chỉ đơn thuần là giết người, mà là chuỗi báo thù dai dẳng, được che đậy bởi tấm màn tâm linh. Khi những mảnh ghép rời rạc của quá khứ 20 năm trước khớp lại, cú sốc đầu tiên ập đến với Thám tử Kiên. Kẻ dẳng, được che đậy bởi tấm màn tâm linh. Khi những mảnh ghép rời rạc của quá khứ 20 năm trước khớp lại, cú sốc đầu tiên ập đến với Thám tử Kiên. Kẻ đứng sau mọi chuyện không ai khác chính là ông Cường, người bạn thân thiết nhất của cả hai nạn nhân Lương và Thắng, một người tưởng chừng không hề liên quan. Sự thật trần trụi và đau đ đứng sau mọi chuyện không ai khác chính là ông Cường, người bạn thân thiết nhất của cả hai nạn nhân Lương và Thắng, một người tưởng chừng không hề liên quan. Sự thật trần trụi và đau đớn đến nghẹt thở: đây không phải là án mạng ngẫu nhiên mà là sự trả thù cho một mối hận đã âm ỉ suốt hai thập kỷ. Một tình tiết đáng chú ý: chính ông Cường làớn đến nghẹt thở: đây không phải là án mạng ngẫu nhiên mà là sự trả thù cho một mối hận đã âm ỉ suốt hai thập kỷ. Một tình tiết đáng chú ý: chính ông Cường là người đã khóc thương Lương và Thắng nhiều nhất, giả vờ đồng hành cùng Kiên trong mọi cuộc tìm kiếm manh mối. Bắt đầu từ đây một giả thiết mới được đặt ra: liệu còn ai nữa trong bức người đã khóc thương Lương và Thắng nhiều nhất, giả vờ đồng hành cùng Kiên trong mọi cuộc tìm kiếm manh mối. Bắt đầu từ đây một giả thiết mới được đặt ra: liệu còn ai nữa trong bức ảnh cũ năm xưa đang nắm giữ những bí mật chưa kể? ảnh cũ năm xưa đang nắm giữ những bí mật chưa kể?Mặc dù ông Cường đã cúi đầu nhận tội, thừa nhận mọi hành vi giết người để trả thù cho mốiMặc dù ông Cường đã cúi đầu nhận tội, thừa nhận mọi hành vi giết người để trả thù cho mối hận âm ỉ suốt hai thập kỷ, vụ án vẫn chưa hoàn toàn khép lại. Những tưởng bí ẩn đã được phơi bày hoàn toàn, nhưng một tình tiết đáng chú ý đã xuất hiện, khiến toàn bộ cục diện hận âm ỉ suốt hai thập kỷ, vụ án vẫn chưa hoàn toàn khép lại. Những tưởng bí ẩn đã được phơi bày hoàn toàn, nhưng một tình tiết đáng chú ý đã xuất hiện, khiến toàn bộ cục diện thay đổi.\n\nTrong quá trình sàng lọc lại các tài liệu cũ và lời khai, một báo cáo khám nghiệm tử thi từ hai mươi năm trước bất ngờ được phát hiện. Báo cáo này liên quan đến một người phụ nữ trẻ, thay đổi.\n\nTrong quá trình sàng lọc lại các tài liệu cũ và lời khai, một báo cáo khám nghiệm tử thi từ hai mươi năm trước bất ngờ được phát hiện. Báo cáo này liên quan đến một người phụ nữ trẻ, có đặc điểm nhận dạng trùng khớp với người trong bức ảnh ố vàng mà Sư Định trao cho Kiên – người phụ nữ với ánh mắt khắc khoải. Theo hồ sơ, cô được xác định đã chết trong một vụ tai nạn bí có đặc điểm nhận dạng trùng khớp với người trong bức ảnh ố vàng mà Sư Định trao cho Kiên – người phụ nữ với ánh mắt khắc khoải. Theo hồ sơ, cô được xác định đã chết trong một vụ tai nạn bí ẩn, và thi thể không tìm thấy hoàn chỉnh.\n\nTuy nhiên, khi tổ trinh sát tiếp tục rà soát khu vực hẻo lánh phía Bắc thị trấn, một người phụ nữ với dáng vẻ tiều tụy, ánh ẩn, và thi thể không tìm thấy hoàn chỉnh.\n\nTuy nhiên, khi tổ trinh sát tiếp tục rà soát khu vực hẻo lánh phía Bắc thị trấn, một người phụ nữ với dáng vẻ tiều tụy, ánh mắt đầy ám ảnh đã được tìm thấy. Qua đối chiếu dữ liệu sinh trắc học và dấu vết cũ, Lực lượng chức năng đã bàng hoàng xác nhận đó chính là người phụ nữ tưởng chừng đã chết cách đây hai thập kỷ. Cô mắt đầy ám ảnh đã được tìm thấy. Qua đối chiếu dữ liệu sinh trắc học và dấu vết cũ, Lực lượng chức năng đã bàng hoàng xác nhận đó chính là người phụ nữ tưởng chừng đã chết cách đây hai thập kỷ. Cô không chỉ sống sót, mà còn là người nắm giữ chìa khóa cho một phần bí mật đen tối nhất của thị trấn Sương Mù.\n\nVậy thì rốt cuộc, nếu ông Cường là kẻ giết người, thì người phụ nữ này – không chỉ sống sót, mà còn là người nắm giữ chìa khóa cho một phần bí mật đen tối nhất của thị trấn Sương Mù.\n\nVậy thì rốt cuộc, nếu ông Cường là kẻ giết người, thì người phụ nữ này – nạn nhân được cho là đã chết – nay lại sống sót, cô ta đóng vai trò gì trong chuỗi bi kịch kéo dài này? Liệu kẻ sát nhân thật sự đã chết, hay một bóng ma từ quá khứ vẫn đang nạn nhân được cho là đã chết – nay lại sống sót, cô ta đóng vai trò gì trong chuỗi bi kịch kéo dài này? Liệu kẻ sát nhân thật sự đã chết, hay một bóng ma từ quá khứ vẫn đang ẩn mình chờ đợi? Câu hỏi nhức nhối này lại một lần nữa bao trùm thị trấn Sương Mù, đẩy Thám tử Kiên vào một cuộc chiến cam go hơn bao giờ hết. ẩn mình chờ đợi? Câu hỏi nhức nhối này lại một lần nữa bao trùm thị trấn Sương Mù, đẩy Thám tử Kiên vào một cuộc chiến cam go hơn bao giờ hết."

    // Split text into chunks
    const chunks = splitTextIntoChunks(text, 1500);
    console.log(`Text split into ${chunks.length} chunks`);

    // Convert all chunks to speech in parallel
    const audioFiles = await Promise.all(
      chunks.map((chunk, index) => 
        convertChunkToSpeech(chunk, index, chunks.length, onProgress)
      )
    );

    onProgress?.({
      current: chunks.length,
      total: chunks.length,
      currentChunk: 'Completed all chunks',
      status: 'completed'
    });

    return audioFiles;
  } catch (error) {
    console.error('Error in convertTextToSpeech:', error);
    onProgress?.({
      current: 0,
      total: 0,
      currentChunk: 'Error occurred',
      status: 'error'
    });
    throw error;
  }
}

// Function to download all audio files
export function downloadAllAudioFiles(audioFiles: Array<{blob: Blob, filename: string, url: string}>): void {
  audioFiles.forEach((file, index) => {
    setTimeout(() => {
      downloadBlob(file.blob, file.filename);
    }, index * 100); // Small delay between downloads
  });
}

// Function to save story to localStorage
export function saveStoryToLocalStorage(story: string, timestamp: string = new Date().toISOString()): void {
  const storyData = {
    content: story,
    timestamp,
    id: `story_${Date.now()}`
  };
  
  try {
    const existingStories = getStoriesFromLocalStorage();
    const updatedStories = [storyData, ...existingStories];
    localStorage.setItem('generated_stories', JSON.stringify(updatedStories));
  } catch (error) {
    console.error('Error saving story to localStorage:', error);
  }
}

// Function to get stories from localStorage
export function getStoriesFromLocalStorage(): Array<{content: string, timestamp: string, id: string}> {
  try {
    const stories = localStorage.getItem('generated_stories');
    return stories ? JSON.parse(stories) : [];
  } catch (error) {
    console.error('Error getting stories from localStorage:', error);
    return [];
  }
}

export type { TTSProgress }; 