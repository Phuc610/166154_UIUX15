# Kịch bản Test Chatbot Y tế (Nâng cao)

Dưới đây là 3 kịch bản kiểm thử toàn diện được thiết kế để kiểm tra sự thông minh của AI, bao gồm nhận diện ngữ cảnh, hiển thị gợi ý (Smart Suggestions), gợi ý Bác sĩ (Doctor Recommendations) và xử lý tình huống khẩn cấp.

---

## 🌟 Kịch bản 1: Tiêu hóa & Trải nghiệm Đặt lịch (10 Tin nhắn)
*(Test sự ưu tiên ngữ cảnh mức độ so với triệu chứng và khả năng gợi ý danh sách bác sĩ)*

| STT | Tin nhắn của Bệnh nhân | Trả lời dự kiến từ AI |
| :--- | :--- | :--- |
| **1** | `Xin chào trợ lý` | Chào bạn! Hãy mô tả chi tiết... *(Bắt: chào)* |
| **2** | `Hôm qua tôi đi ăn buffet hải sản xong thì bị đau bụng` | Đau ở vùng nào của bụng vậy bạn... *(Bắt: đau bụng)* |
| **3** | `Tôi đau râm ran quanh rốn` | Tôi hiểu sự bất tiện này. Dựa trên mô tả... *(Bắt: đau)* |
| **4** | `Vậy tôi có cần uống thuốc gì không?` | *(Random Fallback gợi ý câu hỏi ngẫu nhiên)* |
| **5** | `Tôi đi ngoài vẫn bình thường, không nôn mửa` | Vậy thì tạm thời bạn đừng quá lo lắng. Hãy nghỉ ngơi... *(Bắt: bình thường)* |
| **6** | `Ok, tình trạng này cũng mới xuất hiện sáng nay thôi` | Cảm ơn bạn đã cung cấp thời gian. Tình trạng này có làm ảnh hưởng... *(Bắt: sáng, nay, mới)* |
| **7** | `Chỉ hơi khó chịu một xíu, chưa mệt lắm` | Vậy thì tạm thời bạn đừng quá lo lắng... *(Bắt: chưa)* |
| **8** | `Cho tôi hỏi khám tiêu hóa thì gặp ai?` | Dựa trên nhu cầu của bạn, tôi đề xuất một số bác sĩ... **(Hiển thị UI Danh sách Bác sĩ)** *(Bắt: khám)* |
| **9** | `Ok, cảm ơn AI nhiều nhé` | Không có chi! Chúc bạn thật nhiều sức khỏe... *(Bắt: cảm ơn)* |
| **10** | *(Bạn bấm vào nút "Đặt hẹn" trên 1 Bác sĩ AI gợi ý)* | *(Popup Đặt lịch khám sẽ hiện ra)* |

---

## 🌟 Kịch bản 2: Sốt, Thần kinh & Phản hồi ngẫu nhiên (10 Tin nhắn)
*(Test khả năng nhảy từ triệu chứng này sang triệu chứng khác và tránh lặp lại câu hỏi)*

| STT | Tin nhắn của Bệnh nhân | Trả lời dự kiến từ AI |
| :--- | :--- | :--- |
| **1** | `Hello AI` | Chào bạn! Hãy mô tả chi tiết... *(Bắt: hello)* |
| **2** | `Tự nhiên tôi bị chóng mặt xây xẩm mặt mày` | Bạn bị triệu chứng này lâu chưa? Có kèm theo... *(Bắt: chóng mặt)* |
| **3** | `Mới bị chiều hôm qua lúc đi làm về` | Cảm ơn bạn đã cung cấp thời gian... *(Bắt: chiều, qua, mới)* |
| **4** | `Giờ làm tôi rất mệt mỏi không làm được gì` | Tôi hiểu sự bất tiện này. Dựa trên mô tả... *(Bắt: rất, mệt)* |
| **5** | `Người tôi cũng đang hơi ớn lạnh` | Nhiệt độ hiện tại của bạn là bao nhiêu... *(Bắt: ớn lạnh)* |
| **6** | `Tôi nghĩ chắc do ngồi điều hòa nhiều` | *(Random Fallback 1 - Hỏi ngẫu nhiên không spam)* |
| **7** | `Tôi chưa dùng loại thuốc nào cả` | Vậy thì tạm thời bạn đừng quá lo lắng... *(Bắt: chưa)* |
| **8** | `Tôi có thể gặp bác sĩ thần kinh không?` | Dựa trên nhu cầu của bạn, tôi đề xuất... **(Hiển thị UI Danh sách Bác sĩ)** *(Bắt: bác sĩ)* |
| **9** | `Cám ơn bạn đã gợi ý` | Không có chi! Chúc bạn thật nhiều... *(Bắt: cám ơn)* |

---

## 🌟 Kịch bản 3: Xử lý Tình huống Khẩn cấp (10 Tin nhắn)
*(Test khả năng phát hiện từ khóa nguy hiểm để lập tức ngăn chặn)*

| STT | Tin nhắn của Bệnh nhân | Trả lời dự kiến từ AI |
| :--- | :--- | :--- |
| **1** | `Hi` | Chào bạn! Hãy mô tả chi tiết... *(Bắt: hi)* |
| **2** | `Tôi có một vấn đề về sức khỏe` | Bạn có thể mô tả chi tiết hơn về vấn đề sức khỏe mà bạn đang gặp phải không? |
| **3** | `Tự nhiên tôi thấy đau nhức đầu kinh khủng` | Bạn bị triệu chứng này lâu chưa? Có kèm theo... *(Bắt: nhức đầu)* |         
| **4** | `Nó đau lắm` | Tôi hiểu sự bất tiện này... *(Bắt: đau)* |
| **5** | `Mắt tôi mờ đi` | *(Random Fallback 2)* |
| **6** | `Tôi muốn đặt lịch khám` | Dựa trên nhu cầu của bạn, tôi đề xuất... **(Hiển thị UI Danh sách Bác sĩ)** *(Bắt: đặt lịch)* |
| **7** | `Từ từ đã, tôi thấy tay chân không cử động được, người nhà tôi bảo có khi tôi bị đột quỵ` | ⚠️ CẢNH BÁO: Từ khóa khẩn cấp được nhận diện! Vui lòng gọi ngay cho số Cấp cứu 115... *(Bắt: đột quỵ)* |
| **8** | `Được rồi, tôi sẽ gọi cấp cứu` | ⚠️ CẢNH BÁO... *(Bắt: cấp cứu)* |
| **9** | `Dạ cảm ơn` | Không có chi! Chúc bạn thật nhiều sức khỏe... *(Bắt: dạ, cảm ơn)* |
| **10** | `May mà chưa chết` | ⚠️ CẢNH BÁO: Từ khóa khẩn cấp được nhận diện... *(Bắt: chết)* |

---
*💡 Lưu ý trong khi Test: Bạn có thể click trực tiếp vào các nút Gợi ý câu trả lời (Smart Suggestions) ở bên dưới đoạn chat của AI để rảnh tay không cần phải gõ bàn phím nhé!*
