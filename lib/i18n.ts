// Translation data
export const translations = {
  vi: {
    homepage: {
      hero: {
        title: "Tạo Truyện Với AI",
        subtitle: "Khám phá sức mạnh của trí tuệ nhân tạo để tạo ra những câu chuyện độc đáo và hấp dẫn. Chỉ với vài cú click, bạn có thể tạo ra những tác phẩm văn học tuyệt vời.",
        cta: "Bắt Đầu Tạo Truyện"
      },
      templates: {
        title: "Chọn Thể Loại Truyện",
        subtitle: "Lựa chọn thể loại phù hợp với ý tưởng của bạn",
        mystery: "Trinh Thám",
        romance: "Lãng Mạn", 
        scifi: "Khoa Học Viễn Tưởng",
        fantasy: "Giả Tưởng",
        horror: "Kinh Dị",
        adventure: "Phiêu Lưu"
      },
      wordCount: {
        label: "Độ dài truyện",
        words: "từ"
      },
      createStory: "Tạo Truyện Ngay",
      features: {
        title: "Tính Năng Nổi Bật",
        subtitle: "Khám phá những tính năng tuyệt vời của AI Story Generator"
      }
    },
    header: {
      title: "AI Story Generator",
      dashboard: "Bảng Điều Khiển",
      home: "Trang Chủ"
    },
    app: {
      title: "Trình tạo truyện AI",
      subtitle: "Kiến tạo những thế giới kỳ ảo từ ý tưởng của bạn.",
      generateError: "Đã xảy ra lỗi khi tạo truyện. Vui lòng kiểm tra API key và thử lại.",
      yourStory: "Câu chuyện của bạn"
    },
    templates: {
      crimeSpiritual: {
        name: "Án mạng tâm linh",
        description: "Một câu chuyện rùng rợn về những vụ án bí ẩn liên quan đến thế giới tâm linh.",
        chapters: {
          "1": "Chương 1: Giới thiệu bối cảnh và nhân vật chính",
          "2": "Chương 2: Phát hiện bất ngờ",
          "3": "Chương 3: Đi sâu vào quá khứ và những bí mật được che giấu",
          "4": "Chương 4: Tình huống đột ngột thay đổi",
          "5": "Chương 5: Câu chuyện tiếp cận đỉnh điểm",
          "6": "Chương 6: Kết thúc bất ngờ và mở ra một bí ẩn mới"
        },
        fields: {
          chuong1_boiduc_chinh: {
            label: "Bối cảnh chính",
            description: "Chọn một bối cảnh cho câu chuyện của bạn",
            options: [
              "Ngôi làng",
              "Ngôi chùa cổ",
              "Bệnh viện bỏ hoang",
              "Địa điểm hẻo lánh",
              "Tòa lâu đài"
            ]
          },
          chuong1_mota_boiduc: {
            label: "Mô tả bối cảnh",
            placeholder: "Một ngôi làng yên bình, tĩnh lặng, nhưng có một cảm giác u ám nặng nề",
            description: "Miêu tả chi tiết về bối cảnh"
          },
          chuong1_ten_nhanvat: {
            label: "Tên nhân vật chính",
            placeholder: "Minh, Lan, Hòa, Tú, Thảo...",
            description: "Tên của nhân vật chính trong câu chuyện"
          },
          chuong1_mota_nhanvat: {
            label: "Mô tả nhân vật chính",
            placeholder: "Một thám tử tài ba, một đứa trẻ mồ côi, một người có quá khứ bí ẩn",
            description: "Miêu tả tính cách và đặc điểm của nhân vật chính"
          },
          chuong1_sukien_khoidau: {
            label: "Sự kiện khởi đầu",
            description: "Sự kiện khiến câu chuyện bắt đầu",
            options: [
              "Phát hiện một cái chết bí ẩn",
              "Một tiếng chuông chùa vang lên kỳ lạ",
              "Một người mất tích",
              "Một hiện tượng siêu nhiên"
            ]
          },
          chuong2_phathien_kyla: {
            label: "Chi tiết phát hiện",
            description: "Mô tả sự kiện bất ngờ mà nhân vật chính phát hiện",
            options: [
              "Một thi thể bị giấu trong một ngôi mộ",
              "Một vật phẩm cổ xưa bị nguyền rủa",
              "Một bức thư lạ",
              "Một chiếc vòng cổ có chữ kỳ lạ"
            ]
          },
          chuong2_nguoi_phathien: {
            label: "Người phát hiện",
            description: "Ai là người đầu tiên phát hiện ra sự kiện này",
            options: [
              "Nhân vật chính",
              "Sư cô Diệu An",
              "Cảnh sát Hà",
              "Người dân trong làng"
            ]
          },
          chuong2_camxuc: {
            label: "Cảm xúc nhân vật chính",
            description: "Miêu tả cảm xúc của nhân vật chính khi phát hiện ra điều kỳ lạ",
            options: [
              "Sự hoảng sợ",
              "Sự kinh ngạc",
              "Sự lo lắng",
              "Sự tò mò"
            ]
          },
          chuong3_bimat_lichsu: {
            label: "Bí mật lịch sử",
            description: "Bí mật mà nhân vật chính khám phá trong quá khứ",
            options: [
              "Một vụ án chưa được giải quyết từ 20 năm trước",
              "Một nghi lễ kỳ lạ",
              "Một sự kiện bị giấu kín về một người thân"
            ]
          },
          chuong3_nhanvat_quakhu: {
            label: "Nhân vật liên quan đến quá khứ",
            description: "Người có mối quan hệ đặc biệt hoặc có liên quan đến quá khứ",
            options: [
              "Sư Thích Chí Định",
              "Bà Năm Chắt",
              "Một người mất tích trong quá khứ"
            ]
          },
          chuong3_manh_moi: {
            label: "Manh mối mới",
            description: "Manh mối mà nhân vật chính tìm thấy",
            options: [
              "Một bức ảnh cũ",
              "Một chiếc vòng tay",
              "Một sổ ghi chép cổ",
              "Một đoạn băng cũ"
            ]
          },
          chuong4_cai_chet: {
            label: "Cái chết bất ngờ",
            description: "Ai là người chết làm thay đổi câu chuyện",
            options: [
              "Một người bạn thân",
              "Một nhân vật phụ quan trọng",
              "Một người lạ"
            ]
          },
          chuong4_nghi_ngo: {
            label: "Người bị nghi ngờ",
            description: "Ai là người bị nghi ngờ?",
            options: [
              "Thầy tu",
              "Cảnh sát",
              "Bạn thân",
              "Người dân trong làng"
            ]
          },
          chuong4_bimat_moi: {
            label: "Bí ẩn mới được phát hiện",
            description: "Chi tiết mới được khám phá thay đổi hướng đi của câu chuyện",
            options: [
              "Một chiếc hộp gỗ với ghi chép kỳ lạ",
              "Một đoạn băng ghi lại cuộc trò chuyện",
              "Một chứng cứ bị che giấu trong một vật phẩm"
            ]
          },
          chuong5_su_that: {
            label: "Sự thật lớn",
            description: "Sự thật về kẻ sát nhân hoặc lý do đằng sau các sự kiện",
            options: [
              "Kẻ sát nhân là người bạn thân nhất",
              "Lý do sát nhân có liên quan đến một vụ việc trong quá khứ",
              "Một nghi lễ tâm linh sai lầm"
            ]
          },
          chuong5_ly_do_tra_thu: {
            label: "Lý do trả thù",
            description: "Động lực đằng sau hành vi trả thù",
            options: [
              "Thù hận kéo dài nhiều năm",
              "Lỗi lầm của gia đình",
              "Sự trả thù vì tình yêu"
            ]
          },
          chuong6_twist_cuoi: {
            label: "Cú twist cuối cùng",
            description: "Chi tiết bất ngờ làm thay đổi hướng câu chuyện",
            options: [
              "Một nhân vật tưởng đã chết xuất hiện",
              "Một chứng cứ mới khiến vụ án không khép lại",
              "Một mối quan hệ không ai ngờ đến"
            ]
          },
          chuong6_cau_hoi_mo: {
            label: "Câu hỏi mở",
            description: "Câu hỏi để lại cho người đọc suy ngẫm",
            options: [
              "Liệu kẻ sát nhân thật sự đã chết?",
              "Ai mới là người thực sự giật dây?",
              "Những linh hồn có được siêu thoát?"
            ]
          }
        }
      }
    },
    styles: {
      prompt1: "Phong cách kể chuyện:\n1.\tGiọng văn:\n    o\tNghiêm túc, trang trọng: Sử dụng từ ngữ chuẩn mực, mang tính tường thuật của báo chí điều tra, thời sự.\n    o\tKịch tính, lôi cuốn: Mở đầu bằng những câu hỏi gợi sự tò mò, những chi tiết \"lạnh gáy\", \"không lời trăn trối nhưng để lại quá nhiều câu hỏi\".\n    o\tKhách quan nhưng có cảm xúc: Tường thuật sự việc một cách chi tiết, dựa trên bằng chứng, nhưng vẫn lồng ghép những nhận định mang tính cảnh báo, suy ngẫm ở cuối truyện.\n    o\tChuyên nghiệp: Sử dụng nhiều thuật ngữ chuyên ngành của công an, điều tra, pháp y (ví dụ: \"đội trọng án\", \"phòng cảnh sát hình sự\", \"hiện trường được phong tỏa\", \"khám nghiệm tử thi\", \"vật chứng\", \"tổ trinh sát\", \"kỹ thuật hình sự\", \"pháp y\", \"giám định ADN\", \"tố tụng\", \"khởi tố\", \"viện kiểm sát\").\n2.\tTiết tấu:\n    o\tNhanh ở đoạn mở đầu: Nhanh chóng giới thiệu vụ án, nạn nhân và những điểm bí ẩn ban đầu để thu hút ngay lập tức.\n    o\tChậm rãi, chi tiết ở đoạn điều tra: Tường thuật tỉ mỉ quá trình khám nghiệm hiện trường, thu thập chứng cứ, lấy lời khai, phân tích dữ liệu. Mỗi tình tiết mới được đưa ra một cách có trình tự, logic.\n    o\tĐẩy cao trào ở những \"nút thắt\": Khi phát hiện những tình tiết quan trọng (bao tay, vết son, dữ liệu camera mâu thuẫn, sự xuất hiện của người chị song sinh).\n    o\tGiải quyết nhanh ở đoạn kết luận điều tra và xét xử: Khi hung thủ đã lộ diện, lời khai được trình bày, và bản án được tuyên.\n    o\tLắng đọng ở phần kết: Chuyển sang suy ngẫm, đưa ra bài học, thông điệp.\n3.\tPhong cách kể chuyện:\n    o\tTường thuật theo trình tự thời gian: Bắt đầu từ khi phát hiện vụ án, quá trình điều tra, cho đến khi xét xử và kết thúc bằng những suy ngẫm.\n    o\tĐan xen giữa sự kiện và phân tích: Không chỉ kể lại sự việc mà còn lồng ghép những suy luận của cơ quan điều tra, chuyên gia tâm lý tội phạm.\n    o\tSử dụng nhiều chi tiết cụ thể: Ngày, giờ, địa điểm, đặc điểm nhận dạng, vật chứng được mô tả rõ ràng.\n    o\tTạo bất ngờ (plot twist): Sự xuất hiện của người chị song sinh là một yếu tố bất ngờ lớn, thay đổi hướng điều tra.\n    o\tDẫn dắt người đọc/nghe theo dòng suy luận của điều tra viên: Từng bước hé lộ manh mối, loại trừ nghi phạm, cho đến khi tìm ra hung thủ thật sự.\n    o\tKết thúc bằng một thông điệp mang tính xã hội: Không chỉ là một vụ án hình sự đơn thuần mà còn là bài học về mối quan hệ, sự quan tâm, lắng nghe.\n4.\tTừ ngữ đặc trưng:\n    o\tCác cụm từ như: \"Xin chào quý vị khán giả\", \"mới đây tại Hà Nội\", \"vậy thì rốt cuộc chuyện gì đã xảy ra\", \"lực lượng chức năng\", \"hiện trường lập tức được phong tỏa\", \"kết luận tử vong sơ bộ\", \"cán bộ điều tra tiến hành già soát\", \"tuy nhiên\", \"điều này khẳng định\", \"một tình tiết đáng chú ý\", \"dưới sức ép tâm lý\", \"mở ra một hướng điều tra mới\", \"những chi tiết nhỏ nhưng nhất quán\", \"bắt đầu từ đây một giả thiết mới được đặt ra\", \"cú sốc đầu tiên\", \"sự mâu thuẫn buộc tổ điều tra\", \"chính thức cúi đầu nhận tội\", \"theo lời khai\", \"bản án chưa tuyên nhưng sự thật đã rõ\", \"tòa tuyên\", \"vụ án khép lại... nhưng...\", \"câu hỏi nhức nhối\"."
    },
    prompts: {
      storyGeneration: {
        masterNovelist: "Bạn là một tiểu thuyết gia bậc thầy, chuyên viết truyện dài kỳ bằng tiếng Việt.",
        missionDescription: "Nhiệm vụ của bạn là viết một chương truyện dựa trên cấu trúc được cung cấp.",
        storyOverview: "**Tổng quan câu chuyện:**",
        theme: "**Chủ đề:**",
        narrativeStyle: "**Phong cách kể chuyện:**",
        totalLength: "**Tổng độ dài mong muốn:**",
        mainCharacter: "**Nhân vật chính:**",
        setting: "**Bối cảnh:**",
        previousChaptersSummary: "**Tóm tắt các chương trước:**",
        currentChapterRequirements: "**Yêu cầu cho chương hiện tại",
        writeFullContent: "Hãy viết đầy đủ nội dung cho chương này với độ dài khoảng",
        writingGuidelines: "từ. Đừng chỉ tóm tắt.\nHãy viết một cách hấp dẫn, chi tiết, giàu cảm xúc và đảm bảo tính liền mạch với các chương trước.",
        beginWriting: "Bắt đầu viết nội dung cho",
        detailsToFollow: "Chi tiết cần bám sát cho chương này:",
        noSpecificDetails: "Không có chi tiết cụ thể cho chương này. Hãy sáng tạo dựa trên bối cảnh tổng thể.",
        nothingHappened: "Chưa có gì xảy ra.",
        summaryTitle: "**Tóm tắt",
        onlyResult: "Chỉ trả lời kết quả, Không lặp lại câu vừa kể, không trả lời các phần không cần thiết, tuyệt đối không cần các đoạn trả lời như Tuyệt vời, Dưới đây là nội dung ....",
        errorGenerating: "Lỗi khi tạo",
        pleaseRetry: "Vui lòng thử lại."
      }
    },
    dashboard: {
      title: "Dashboard Truyện",
      description: "Quản lý các truyện đã tạo",
      noStories: "Chưa có truyện nào",
      noStoriesDesc: "Hãy tạo truyện đầu tiên của bạn!",
      createFirst: "Tạo truyện ngay",
      totalStories: "Tổng số truyện",
      refresh: "Làm mới"
    }
  },
  en: {
    homepage: {
      hero: {
        title: "Create Stories with AI",
        subtitle: "Discover the power of artificial intelligence to create unique and engaging stories. With just a few clicks, you can create amazing literary works.",
        cta: "Start Creating Stories"
      },
      templates: {
        title: "Choose Story Genre",
        subtitle: "Select a genre that fits your idea",
        mystery: "Mystery",
        romance: "Romance",
        scifi: "Science Fiction", 
        fantasy: "Fantasy",
        horror: "Horror",
        adventure: "Adventure"
      },
      wordCount: {
        label: "Story length",
        words: "words"
      },
      createStory: "Create Story Now",
      features: {
        title: "Featured Functions",
        subtitle: "Explore the amazing features of AI Story Generator"
      }
    },
    header: {
      title: "AI Story Generator",
      dashboard: "Dashboard",
      home: "Home"
    },
    app: {
      title: "AI Story Generator",
      subtitle: "Craft magical worlds from your ideas.",
      generateError: "An error occurred while generating the story. Please check your API key and try again.",
      yourStory: "Your Story"
    },
    templates: {
      crimeSpiritual: {
        name: "Spiritual Crime",
        description: "A spine-chilling story about mysterious cases related to the spiritual world.",
        chapters: {
          "1": "Chapter 1: Introduction of setting and main character",
          "2": "Chapter 2: Unexpected discovery",
          "3": "Chapter 3: Delving into the past and hidden secrets",
          "4": "Chapter 4: Sudden situation change",
          "5": "Chapter 5: Story approaching climax",
          "6": "Chapter 6: Unexpected ending and opening a new mystery"
        },
        fields: {
          chuong1_boiduc_chinh: {
            label: "Main Setting",
            description: "Choose a setting for your story",
            options: [
              "Village",
              "Ancient Temple",
              "Abandoned Hospital",
              "Remote Location",
              "Castle"
            ]
          },
          chuong1_mota_boiduc: {
            label: "Setting Description",
            placeholder: "A peaceful, quiet village, but with a heavy, ominous feeling",
            description: "Detailed description of the setting"
          },
          chuong1_ten_nhanvat: {
            label: "Main Character Name",
            placeholder: "John, Jane, Alex, Sarah, Emma...",
            description: "Name of the main character in the story"
          },
          chuong1_mota_nhanvat: {
            label: "Main Character Description",
            placeholder: "A talented detective, an orphaned child, a person with a mysterious past",
            description: "Description of the main character's personality and traits"
          },
          chuong1_sukien_khoidau: {
            label: "Starting Event",
            description: "The event that starts the story",
            options: [
              "Discovery of a mysterious death",
              "A strange temple bell ringing",
              "A person goes missing",
              "A supernatural phenomenon"
            ]
          },
          chuong2_phathien_kyla: {
            label: "Discovery Details",
            description: "Description of the unexpected event discovered by the main character",
            options: [
              "A corpse hidden in a grave",
              "A cursed ancient artifact",
              "A strange letter",
              "A necklace with strange markings"
            ]
          },
          chuong2_nguoi_phathien: {
            label: "Person Who Discovered",
            description: "Who first discovered this event",
            options: [
              "Main character",
              "Sister Dieu An",
              "Police Officer Ha",
              "Village residents"
            ]
          },
          chuong2_camxuc: {
            label: "Main Character's Emotions",
            description: "Description of the main character's emotions upon discovering the strange occurrence",
            options: [
              "Terror",
              "Amazement",
              "Worry",
              "Curiosity"
            ]
          },
          chuong3_bimat_lichsu: {
            label: "Historical Secret",
            description: "Secret that the main character discovers in the past",
            options: [
              "An unsolved case from 20 years ago",
              "A strange ritual",
              "A hidden event about a relative"
            ]
          },
          chuong3_nhanvat_quakhu: {
            label: "Character Related to the Past",
            description: "Person with special relationship or connection to the past",
            options: [
              "Master Thich Chi Dinh",
              "Mrs. Nam Chat",
              "A person who disappeared in the past"
            ]
          },
          chuong3_manh_moi: {
            label: "New Clue",
            description: "Clue found by the main character",
            options: [
              "An old photograph",
              "A bracelet",
              "An ancient notebook",
              "An old tape recording"
            ]
          },
          chuong4_cai_chet: {
            label: "Unexpected Death",
            description: "Who dies to change the story",
            options: [
              "A close friend",
              "An important supporting character",
              "A stranger"
            ]
          },
          chuong4_nghi_ngo: {
            label: "Suspected Person",
            description: "Who is suspected?",
            options: [
              "Monk",
              "Police officer",
              "Close friend",
              "Village residents"
            ]
          },
          chuong4_bimat_moi: {
            label: "Newly Discovered Mystery",
            description: "New detail discovered that changes the story's direction",
            options: [
              "A wooden box with strange notes",
              "A tape recording of a conversation",
              "Evidence hidden in an object"
            ]
          },
          chuong5_su_that: {
            label: "The Big Truth",
            description: "Truth about the killer or reason behind the events",
            options: [
              "The killer is the closest friend",
              "The murder reason is related to a past incident",
              "A mistaken spiritual ritual"
            ]
          },
          chuong5_ly_do_tra_thu: {
            label: "Reason for Revenge",
            description: "Motivation behind the act of revenge",
            options: [
              "Hatred lasting many years",
              "Family mistakes",
              "Revenge for love"
            ]
          },
          chuong6_twist_cuoi: {
            label: "Final Twist",
            description: "Unexpected detail that changes the story direction",
            options: [
              "A character thought dead appears",
              "New evidence prevents case closure",
              "An unexpected relationship"
            ]
          },
          chuong6_cau_hoi_mo: {
            label: "Open Question",
            description: "Question left for readers to ponder",
            options: [
              "Is the killer truly dead?",
              "Who is really pulling the strings?",
              "Have the souls found peace?"
            ]
          }
        }
      }
    },
    styles: {
      prompt1: "Narrative style:\n1. Writing tone:\n    o Serious, formal: Use standard vocabulary, with the narrative quality of investigative journalism, current affairs.\n    o Dramatic, engaging: Start with curiosity-provoking questions, 'chilling' details, 'no last words but leaving too many questions.'\n    o Objective but emotional: Report events in detail, based on evidence, but still incorporate cautionary, reflective judgments at the end of the story.\n    o Professional: Use many specialized terms from police, investigation, forensics (e.g., 'major crimes team', 'criminal police department', 'scene cordoned off', 'autopsy', 'evidence', 'surveillance team', 'forensic technique', 'forensics', 'DNA testing', 'litigation', 'prosecution', 'prosecutor's office').\n2. Pace:\n    o Fast at the opening: Quickly introduce the case, victim and initial mysteries to attract immediately.\n    o Slow, detailed in the investigation section: Meticulously report the process of examining the scene, collecting evidence, taking statements, analyzing data. Each new detail is presented in an orderly, logical manner.\n    o Peak at 'bottlenecks': When discovering important details (gloves, lipstick marks, contradictory camera data, appearance of twin sister).\n    o Quick resolution in the investigation conclusion and trial section: When the perpetrator is exposed, testimony is presented, and the verdict is announced.\n    o Contemplative at the end: Shift to reflection, presenting lessons, messages.\n3. Storytelling style:\n    o Chronological narrative: Start from when the case is discovered, investigation process, until trial and end with reflections.\n    o Interweaving events and analysis: Not just retelling events but also incorporating reasoning from investigation agencies, criminal psychology experts.\n    o Use many specific details: Date, time, location, identifying characteristics, evidence clearly described.\n    o Create surprises (plot twist): The appearance of the twin sister is a major surprise element, changing the investigation direction.\n    o Guide readers/listeners through the investigator's reasoning: Step by step revealing clues, eliminating suspects, until finding the real perpetrator.\n    o End with a social message: Not just a simple criminal case but also a lesson about relationships, care, listening.\n4. Characteristic vocabulary:\n    o Phrases like: 'Hello dear viewers', 'recently in Hanoi', 'so what really happened', 'functional forces', 'scene immediately cordoned off', 'preliminary death conclusion', 'investigating officers conduct review', 'however', 'this confirms', 'a noteworthy detail', 'under psychological pressure', 'opening a new investigation direction', 'small but consistent details', 'starting from here a new hypothesis is proposed', 'first shock', 'contradiction forces investigation team', 'officially bow head and confess', 'according to testimony', 'verdict not yet announced but truth is clear', 'court announces', 'case closed... but...', 'nagging question'."
    },
    prompts: {
      storyGeneration: {
        masterNovelist: "You are a master novelist, specializing in writing long-form stories in English.",
        missionDescription: "Your mission is to write a story chapter based on the provided structure.",
        storyOverview: "**Story Overview:**",
        theme: "**Theme:**",
        narrativeStyle: "**Narrative Style:**",
        totalLength: "**Desired Total Length:**",
        mainCharacter: "**Main Character:**",
        setting: "**Setting:**",
        previousChaptersSummary: "**Summary of Previous Chapters:**",
        currentChapterRequirements: "**Requirements for Current Chapter",
        writeFullContent: "Please write full content for this chapter with approximately",
        writingGuidelines: "words. Don't just summarize.\nWrite in an engaging, detailed, emotionally rich way and ensure continuity with previous chapters.",
        beginWriting: "Begin writing content for",
        detailsToFollow: "Details to follow for this chapter:",
        noSpecificDetails: "No specific details for this chapter. Please be creative based on the overall context.",
        nothingHappened: "Nothing has happened yet.",
        summaryTitle: "**Summary",
        onlyResult: "Only answer the result, Don't repeat the sentence just told, don't answer unnecessary parts, absolutely no need for answer segments like Great, Below is the content ....",
        errorGenerating: "Error generating",
        pleaseRetry: "Please try again."
      }
    },
    dashboard: {
      title: "Story Dashboard",
      description: "Manage your created stories",
      noStories: "No stories yet",
      noStoriesDesc: "Create your first story!",
      createFirst: "Create story now",
      totalStories: "Total stories",
      refresh: "Refresh"
    }
  }
}; 