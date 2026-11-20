import re, subprocess, json, sys
A="/mnt/user-data/attachments/c1ead8e7-f7de-5860-bc05-5878f0f5d505/"
OUT="/home/claude/dlu-showcase/public/audio/"
FPS=30
files={1:"ae15e700-xin-chao-chao-mung-ban-den-voi",2:"3ae70f61-trang-chu-la-cua-ngo-cua-he",3:"f2146ddb-muc-viec-lam-tap-hop-tin-tuyen",4:"454b3a93-su-kien-la-noi-cac-the-he-gap",5:"ee39d4e1-goc-chia-se-luu-giu-nhung-kinh",6:"8149b01d-thu-vien-anh-luu-lai-nhung",7:"b0d8a146-quy-hoc-bong-duoc-cong-khai",8:"98cb221c-cuoi-cung-la-hai-vai-tro-van"}
texts={
1:"Xin chào! Chào mừng bạn đến với Đê Lờ U Connect, mạng lưới kết nối cựu sinh viên và doanh nghiệp đối tác của Khoa Công nghệ Thông tin, Trường Đại học Đà Lạt. Đây là nơi sinh viên, cựu sinh viên, doanh nghiệp và nhà trường cùng gặp nhau trên một nền tảng duy nhất, để chia sẻ cơ hội, kinh nghiệm và những câu chuyện của cộng đồng Đê Lờ U. Nào, mời bạn cùng khám phá những chức năng chính của hệ thống.",
2:"Trang chủ là cửa ngõ của hệ thống, ai cũng có thể xem mà không cần đăng nhập. Ngay đầu trang là tin tức và sự kiện nổi bật của Khoa. Cuộn xuống, bạn gặp mục cơ hội nghề nghiệp với những tin tuyển dụng đã được Khoa xác thực. Tiếp theo là những gương mặt cựu sinh viên cùng các câu chuyện truyền cảm hứng. Kế đến là học bổng với sự đồng hành của doanh nghiệp, kèm tiến độ quỹ học bổng được cập nhật công khai. Phần mạng lưới doanh nghiệp đối tác giới thiệu những đơn vị cùng Khoa kết nối với sinh viên. Thư viện ảnh lưu lại khoảnh khắc của các thế hệ Đê Lờ U. Và cuối trang là thông tin liên hệ của Khoa Công nghệ Thông tin, Trường Đại học Đà Lạt.",
3:"Mục Việc làm tập hợp tin tuyển dụng và thực tập từ các doanh nghiệp đối tác. Bạn có thể tìm theo từ khóa, lọc theo hình thức làm việc như thực tập sinh hay toàn thời gian, và sắp xếp theo mức lương cao nhất. Khi chọn một vị trí, bạn xem được mô tả công việc, yêu cầu và quyền lợi đầy đủ, rồi ứng tuyển ngay trên hệ thống, không cần gửi hồ sơ qua nhiều kênh.",
4:"Sự kiện là nơi các thế hệ gặp nhau. Bạn xem lịch hội thảo, talkshow và workshop, mỗi sự kiện đều có thời gian, địa điểm và diễn giả. Điểm đặc biệt là việc mời cựu sinh viên làm diễn giả. Với tài khoản Quản trị Khoa, chỉ cần vào sự kiện, chọn mục mời diễn giả, chọn một cựu sinh viên trong danh sách và gửi kèm lời nhắn. Lời mời được ghi nhận ở trạng thái chờ phản hồi. Phía cựu sinh viên, anh chị nhận lời mời ngay trong tài khoản của mình và chỉ cần một chạm để đồng ý hoặc từ chối. Ngay sau đó, diễn giả hiển thị trên trang sự kiện để sinh viên biết và đăng ký tham dự.",
5:"Góc chia sẻ lưu giữ những kinh nghiệm quý giá từ cựu sinh viên: hành trình phỏng vấn, định hướng nghề nghiệp, bài học khi đi làm. Với tài khoản cựu sinh viên, bạn có bảng điều khiển riêng, tra cứu mạng lưới cựu sinh viên, và viết bài chia sẻ của chính mình để truyền lửa cho thế hệ sau. Bài viết được Khoa duyệt trước khi hiển thị.",
6:"Thư viện ảnh lưu lại những khoảnh khắc của Khoa qua từng sự kiện. Mỗi album có nhiều hình, bạn có thể xem toàn màn hình và lướt qua từng ảnh để cùng nhìn lại những kỷ niệm đáng nhớ.",
7:"Quỹ học bổng được công khai minh bạch. Từ trang Quỹ học bổng, bạn chọn một chiến dịch để xem chi tiết: mục tiêu, số tiền đã đóng góp và tiến độ được cập nhật liên tục. Bên dưới là cam kết đóng góp từ doanh nghiệp và cựu sinh viên. Với tài khoản sinh viên, bạn vào mục Học bổng, xem các học bổng đang mở, chọn học bổng phù hợp rồi bấm ứng tuyển. Tiếp đó, bạn điền thông tin vào đơn, kiểm tra lại và gửi hồ sơ chỉ với vài thao tác.",
8:"Cuối cùng là hai vai trò vận hành hệ thống. Với tài khoản Doanh nghiệp đối tác, bạn vào bảng điều khiển, mở mục Tin tuyển dụng để xem các vị trí đã đăng, rồi bấm Đăng tin mới: nhập vị trí, mô tả, yêu cầu, quyền lợi và gửi đi chờ Khoa duyệt. Doanh nghiệp cũng quản lý hồ sơ công ty và tài trợ cho các hoạt động của Khoa. Chuyển sang tài khoản Quản trị Khoa, bảng điều khiển cho thấy toàn bộ hoạt động của hệ thống. Tại mục Duyệt doanh nghiệp, quản trị viên xem hồ sơ và phê duyệt đối tác. Tại mục Duyệt tin tuyển dụng, từng tin được kiểm tra trước khi hiển thị. Cũng từ đây, Khoa duyệt bài chia sẻ, quản lý sự kiện, hình ảnh, banner và các chiến dịch học bổng. Cuối cùng, Nhật ký hoạt động ghi lại mọi thay đổi để dễ theo dõi. Đê Lờ U Connect, kết nối thế hệ, kiến tạo tương lai.",
}
def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]))
def silences(p):
    r=subprocess.run(["ffmpeg","-hide_banner","-i",p,"-af","silencedetect=noise=-35dB:d=0.2","-f","null","-"],capture_output=True,text=True).stderr
    s=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",r)]
    e=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",r)]
    return list(zip(s,e))
def sentences(t):
    return [x.strip() for x in re.split(r"(?<=[.!])\s+",t) if x.strip()]
def split_points(sc):
    """thời điểm cắt giữa các câu (giữa khoảng lặng gần nhất so với ước lượng theo số ký tự)"""
    p=A+files[sc]+"_hai-dang.mp3"; D=dur(p); sil=[x for x in silences(p) if x[0]>0.3 and x[1]<D-0.1]
    ss=sentences(texts[sc]); tot=sum(len(x) for x in ss); cum=0; pts=[]
    for x in ss[:-1]:
        cum+=len(x); est=cum/tot*D
        # chọn khoảng lặng dài nhất trong cửa sổ ±1.0 s quanh ước lượng
        cand=[s for s in sil if abs((s[0]+s[1])/2-est)<1.0]
        best=max(cand,key=lambda s:(s[1]-s[0])-0.15*abs((s[0]+s[1])/2-est)) if cand else None
        pts.append((best[0]+best[1])/2 if best else est)
    return p,D,ss,pts
# lịch bắt đầu từng câu: frame cục bộ trong cảnh (None = ngay sau câu trước)
PLAN={
2:[20,70,255,490,725,960,1145,1380],
3:[70,None,470],
4:[66,None,396,None,759,1034,1364],
5:[80,549,938],
6:[60,470],
7:[70,230,None,440,640],
8:[70,180,None,676,900,1080,1280,1680],
}
GAP=10
def build(sc,groups_end=None):
    p,D,ss,pts=split_points(sc)
    bounds=[0]+pts+[D]
    plan=PLAN[sc]; assert len(plan)==len(ss) or (sc==8 and len(plan)==len(ss)-1), (sc,len(plan),len(ss))
    segs=[]
    prev_end=0
    for i,f in enumerate(plan):
        a=bounds[i]; b=bounds[i+1]
        # bỏ khoảng lặng dài ở đầu/cuối
        a=max(0,a-0.0)
        d=b-a
        start=(f if f is not None else prev_end+GAP)
        start=max(start,prev_end+GAP) if i>0 else start
        segs.append((a,b,start)); prev_end=start+round(d*FPS)
    return p,D,ss,bounds,segs
def render(sc,tag):
    p,D,ss,bounds,segs=build(sc)
    total=max(s[2]/FPS+(s[1]-s[0]) for s in segs)+0.3
    cmd=["ffmpeg","-y","-hide_banner","-loglevel","error"]
    filt=[]
    for i,(a,b,st) in enumerate(segs):
        cmd+=["-i",p]
        filt.append(f"[{i}:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st={b-a-0.05:.3f}:d=0.05,adelay={int(st/FPS*1000)}|{int(st/FPS*1000)}[s{i}]")
    mix="".join(f"[s{i}]" for i in range(len(segs)))
    filt.append(f"{mix}amix=inputs={len(segs)}:normalize=0,apad=pad_dur=0.1[o]")
    cmd+=["-filter_complex",";".join(filt),"-map","[o]","-t",f"{total:.2f}","-c:a","libmp3lame","-q:a","2",OUT+tag]
    subprocess.check_call(cmd)
    print(sc,tag,"total %.1fs"%total,[(round(a,1),round(b,1),st) for a,b,st in segs])
    for s,(a,b,st) in zip(ss,segs): print("   ",round(st/FPS,1),"s |",round(b-a,1),"s |",s[:50])
def render_range(sc,tag,i0,i1,starts):
    p,D,ss,bounds,segs=None,None,None,None,None
    p,D,ss,pts=split_points(sc); bounds=[0]+pts+[D]
    cmd=["ffmpeg","-y","-hide_banner","-loglevel","error"]; filt=[]; prev=0; items=[]
    for k,i in enumerate(range(i0,i1)):
        a,b=bounds[i],bounds[i+1]; st=starts[k] if starts[k] is not None else prev+GAP; st=max(st,prev+GAP) if k else st
        items.append((a,b,st)); prev=st+round((b-a)*FPS)
    for k,(a,b,st) in enumerate(items):
        cmd+=["-i",p]
        filt.append(f"[{k}:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st={b-a-0.05:.3f}:d=0.05,adelay={int(st/FPS*1000)}|{int(st/FPS*1000)}[s{k}]")
    n=len(items); mix="".join(f"[s{k}]" for k in range(n))
    filt.append(f"{mix}amix=inputs={n}:normalize=0,apad=pad_dur=0.1[o]" if n>1 else "[s0]apad=pad_dur=0.1[o]")
    cmd+=["-filter_complex",";".join(filt),"-map","[o]","-c:a","libmp3lame","-q:a","2",OUT+tag]
    subprocess.check_call(cmd)
    print(tag,[(round(a,1),round(b,1),st) for a,b,st in items],"end %.1fs"%(prev/FPS))
    for k,i in enumerate(range(i0,i1)): print("   ",ss[i][:60])
if __name__=="__main__":
    if sys.argv[1]=="special":
        render_range(1,"voice-intro.mp3",0,2,[20,None])
        render_range(1,"voice-1.mp3",2,4,[130,380])
        render_range(8,"voice-outro.mp3",8,9,[70])
        sys.exit()
    for sc in [int(x) for x in sys.argv[1:]]: render(sc,f"voice-{sc}.mp3")
