import streamlit as st
import os
import pandas as pd
from streamlit_lottie import st_lottie
from database import init_db, verify_login, register_user, get_all_users, update_status, add_history, get_user_history
from utils.ai_generator import generate_paraphrase
from utils.text_metrics import get_readability_scores

# --- Page Configuration ---
st.set_page_config(page_title="Metaphrase | Portal", page_icon="✨", layout="wide")

# Initialize Database on startup
init_db()

# --- Load Custom CSS ---
def load_css(file_path):
    if os.path.exists(file_path):
        with open(file_path) as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css("assets/style.css")

# --- Helper: Load Lottie Animations Safely ---
@st.cache_data
def load_lottie_url(url: str):
    import requests
    try:
        r = requests.get(url, timeout=5)
        if r.status_code != 200: return None
        return r.json()
    except:
        return None

# --- SESSION STATE INIT ---
if 'logged_in' not in st.session_state: st.session_state.logged_in = False
if 'user_email' not in st.session_state: st.session_state.user_email = ""
if 'user_role' not in st.session_state: st.session_state.user_role = ""
if 'diff' not in st.session_state: st.session_state.diff = 'Simple'

# ==========================================
# PAGE 1: LOGIN & REGISTRATION
# ==========================================
def login_page():
    img_col, form_col = st.columns([1.2, 1])
    
    with img_col:
        st.markdown("<br><br><br>", unsafe_allow_html=True)
        lottie_main_login = load_lottie_url("https://assets2.lottiefiles.com/packages/lf20_qp1q7mct.json")
        if lottie_main_login:
            st_lottie(lottie_main_login, height=450, key="login_main_anim")
        else:
            st.info("Loading AI Animation...")

    with form_col:
        st.markdown("<br>", unsafe_allow_html=True)
        
        lottie_logo = load_lottie_url("https://assets5.lottiefiles.com/packages/lf20_tijmpky4.json")
        with st.container():
            col1, col2 = st.columns([1, 4])
            with col1: 
                if lottie_logo:
                    st_lottie(lottie_logo, height=70, key="logo")
                else:
                    st.markdown("<h1 style='margin-top:-10px;'>🤖</h1>", unsafe_allow_html=True)
            with col2: 
                st.markdown("<h1 style='font-size: 3rem; margin-top: -10px;'>Metaphrase AI</h1>", unsafe_allow_html=True)

        st.markdown("<p style='font-size: 1.1rem; color: #64748b;'>Precision Rewriting. Elevated Clarity.</p><br>", unsafe_allow_html=True)
        
        st.markdown("<div class='diff-card' style='height: auto; text-align: left;'>", unsafe_allow_html=True)
        tab_login, tab_register = st.tabs(["🔐 Login", "📝 Register"])
        
        with tab_login:
            lottie_secure = load_lottie_url("https://assets10.lottiefiles.com/packages/lf20_ktwnxv5m.json")
            if lottie_secure:
                st_lottie(lottie_secure, height=120, key="secure_login")
                
            st.write("### Welcome Back")
            login_email = st.text_input("Email Address", key="log_email")
            login_pass = st.text_input("Password", type="password", key="log_pass")
            st.markdown("<br>", unsafe_allow_html=True)
            
            if st.button("Login", type="primary", use_container_width=True):
                user_data = verify_login(login_email, login_pass)
                if user_data:
                    role, status, name = user_data
                    if status == 'pending': st.warning("⏳ Your account is waiting for Admin approval.")
                    elif status == 'rejected': st.error("🚫 Access denied.")
                    elif status == 'accepted':
                        st.session_state.logged_in = True
                        st.session_state.user_email = login_email
                        st.session_state.user_role = role
                        st.rerun()
                else: st.error("❌ Invalid Email or Password.")
                    
        with tab_register:
            lottie_welcome = load_lottie_url("https://assets8.lottiefiles.com/packages/lf20_q5pk6p1k.json")
            if lottie_welcome:
                st_lottie(lottie_welcome, height=120, key="welcome_reg")
                
            st.write("### Create an Account")
            reg_name = st.text_input("Full Name", key="reg_name")
            reg_email = st.text_input("Email Address", key="reg_email")
            reg_pass = st.text_input("Password", type="password", key="reg_pass")
            reg_pass_conf = st.text_input("Confirm Password", type="password", key="reg_conf")
            st.markdown("<br>", unsafe_allow_html=True)
            
            if st.button("Register Account", type="primary", use_container_width=True):
                if not reg_name or not reg_email or not reg_pass: st.warning("Please fill in all fields.")
                elif reg_pass != reg_pass_conf: st.error("Passwords do not match!")
                elif len(reg_pass) < 6: st.warning("Password must be at least 6 characters.")
                else:
                    if register_user(reg_name, reg_email, reg_pass): st.success("✅ Registered! Wait for Admin approval.")
                    else: st.error("⚠️ This email is already registered.")
        st.markdown("</div>", unsafe_allow_html=True)

# ==========================================
# PAGE 2: ADMIN DASHBOARD
# ==========================================
def admin_dashboard():
    with st.container():
        st.markdown("<div style='background: white; padding: 20px; border-radius: 15px; border: 2px solid #0c4a6e;'>", unsafe_allow_html=True)
        col1, col2 = st.columns([8, 1])
        with col1:
            st.title("🛡️ Admin Dashboard")
            st.write(f"Logged in as: **{st.session_state.user_email}**")
        with col2:
            if st.button("Logout", type="primary"):
                st.session_state.logged_in = False
                st.rerun()
        st.markdown("</div><br>", unsafe_allow_html=True)
            
    st.write("### Access Requests")
    users = get_all_users()
    if not users: st.info("No pending users found.")
    else:
        for user in users:
            name, email, role, status = user
            with st.container():
                st.markdown("<div style='background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px; border: 2px solid #0c4a6e; box-shadow: 3px 3px 0 #0c4a6e;'>", unsafe_allow_html=True)
                cols = st.columns([3, 2, 1, 1])
                cols[0].write(f"👤 **{name}**\n\n📧 {email}")
                cols[1].write(f"Status: **{status.upper()}**")
                if cols[2].button("Accept", key=f"acc_{email}", type="primary"):
                    update_status(email, 'accepted')
                    st.rerun()
                if cols[3].button("Reject", key=f"rej_{email}"):
                    update_status(email, 'rejected')
                    st.rerun()
                st.markdown("</div>", unsafe_allow_html=True)

# ==========================================
# PAGE 3: MAIN APP WITH SIDEBAR
# ==========================================
def main_app():
    with st.sidebar:
        lottie_nav = load_lottie_url("https://assets5.lottiefiles.com/packages/lf20_tijmpky4.json")
        if lottie_nav:
            st_lottie(lottie_nav, height=100, key="nav_logo")
            
        st.markdown("<h2 style='text-align: center; color: #0c4a6e;'>Navigation</h2>", unsafe_allow_html=True)
        st.markdown("<br>", unsafe_allow_html=True)
        
        page = st.radio("Go to:", ["✨ Paraphrase Tool", "📊 History & Analytics", "ℹ️ About"], label_visibility="collapsed")
        
        st.write("---")
        st.write(f"👤 **User:**\n{st.session_state.user_email}")
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("Logout", type="primary", use_container_width=True):
            st.session_state.logged_in = False
            st.rerun()

    if page == "✨ Paraphrase Tool": render_paraphrase_tool()
    elif page == "📊 History & Analytics": render_history()
    elif page == "ℹ️ About": render_about()

def render_paraphrase_tool():
    col_title, col_anim = st.columns([4, 1])
    with col_title:
        st.markdown("<h1 style='margin-top: 20px;'>Simplify or Elevate Your Text</h1>", unsafe_allow_html=True)
        st.markdown("<p style='font-size: 1.1rem; color: #64748b;'>Paste any content and instantly rewrite it using AI.</p>", unsafe_allow_html=True)
    with col_anim:
        lottie_para = load_lottie_url("https://assets4.lottiefiles.com/packages/lf20_7wwm6az7.json") 
        if lottie_para:
            st_lottie(lottie_para, height=120, key="para_anim")

    st.write("### Select Difficulty Level")
    c1, c2, c3 = st.columns(3)
    levels = {"Simple": "📖", "Moderate": "⚡", "Advanced": "🧠"}
    
    for col, (key, icon) in zip([c1, c2, c3], levels.items()):
        with col:
            active = "active" if st.session_state.diff == key else ""
            st.markdown(f"""
                <div class="diff-card {active}">
                    <div class="icon">{icon}</div>
                    <div class="title">{key}</div>
                </div>
            """, unsafe_allow_html=True)
            if st.button(f" {key}", key=f"btn_{key}", use_container_width=True):
                st.session_state.diff = key
                st.rerun()

    st.write("---")
    col_in, col_out = st.columns(2)
    
    # Text box height is set to 450 pixels here
    BOX_HEIGHT = 450
    
    with col_in:
        st.write("### Original Text")
        input_text = st.text_area("in", placeholder="Paste your text here...", height=BOX_HEIGHT, label_visibility="collapsed")
    with col_out:
        st.write("### Paraphrased Text")
        output_area = st.empty()
        output_area.text_area("out", value="", height=BOX_HEIGHT, label_visibility="collapsed", disabled=True)

    st.markdown("<br>", unsafe_allow_html=True)
    _, btn_col, _ = st.columns([1, 1, 1])
    with btn_col:
        if st.button("Paraphrase →", type="primary", use_container_width=True):
            if not input_text.strip(): st.warning("Please enter text.")
            else:
                with st.spinner("Processing..."):
                    result = generate_paraphrase(input_text, st.session_state.diff)
                    if result == "SERVICE_ERROR": st.error("AI service busy. Please try again.")
                    else:
                        output_area.text_area("out_final", value=result, height=BOX_HEIGHT, label_visibility="collapsed")
                        add_history(st.session_state.user_email, input_text, result, st.session_state.diff)
                        st.write("### Readability Comparison")
                        try:
                            st.markdown("<div style='background: white; padding: 15px; border-radius: 15px; border: 2px solid #0c4a6e;'>", unsafe_allow_html=True)
                            st.table(get_readability_scores(input_text, result))
                            st.markdown("</div>", unsafe_allow_html=True)
                        except: pass

def render_history():
    col_title, col_anim = st.columns([4, 1])
    with col_title:
        st.markdown("<h1 style='margin-top: 20px;'>📊 Your Paraphrasing History</h1>", unsafe_allow_html=True)
    with col_anim:
        lottie_hist = load_lottie_url("https://assets9.lottiefiles.com/packages/lf20_puciaact.json") 
        if lottie_hist:
            st_lottie(lottie_hist, height=100, key="hist_anim")

    records = get_user_history(st.session_state.user_email)
    
    if not records:
        st.info("You haven't paraphrased anything yet!")
        return
        
    df = pd.DataFrame(records, columns=['Original Text', 'Paraphrased Text', 'Difficulty', 'Date'])
    df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d %H:%M')
    
    st.write("### Usage Analytics")
    diff_counts = df['Difficulty'].value_counts()
    
    col1, col2 = st.columns([1, 2])
    with col1:
        st.markdown("<div style='background: white; padding: 15px; border-radius: 15px; height: 100%; border: 2px solid #0c4a6e;'>", unsafe_allow_html=True)
        st.write("**Difficulty Levels Used**")
        st.bar_chart(diff_counts, color="#0ea5e9") 
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col2:
        st.markdown("<div style='background: white; padding: 25px; border-radius: 15px; height: 100%; border: 2px solid #0c4a6e; display: flex; flex-direction: column; justify-content: center;'>", unsafe_allow_html=True)
        st.markdown(f"<h2>Total Generations: <span style='color: #0ea5e9;'>{len(df)}</span></h2>", unsafe_allow_html=True)
        st.markdown(f"<h2>Most Used Level: <span style='color: #0c4a6e;'>{diff_counts.idxmax()}</span></h2>", unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    st.write("---")
    st.write("### Past Searches")
    st.markdown("<div style='background: white; padding: 15px; border-radius: 15px; border: 2px solid #0c4a6e;'>", unsafe_allow_html=True)
    st.dataframe(df, use_container_width=True, hide_index=True)
    st.markdown("</div>", unsafe_allow_html=True)

def render_about():
    st.title("ℹ️ About Metaphrase")
    
    lottie_about = load_lottie_url("https://assets8.lottiefiles.com/packages/lf20_bhebjzpu.json") 
    
    col_text, col_img = st.columns([1.5, 1])
    with col_img:
        if lottie_about:
            st_lottie(lottie_about, height=350, key="about_ill") 
        
    with col_text:
        st.markdown("""
<div style='background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; border: 2px solid #0c4a6e; box-shadow: 4px 4px 0px #0c4a6e;'>
    <h2 style='color: #0ea5e9;'>Next-Generation AI Text Transformation</h2>
    <p style='font-size: 1.1rem; line-height: 1.6; color: #0c4a6e;'>
    <b>Metaphrase AI</b> is a cutting-edge text transformation tool built for the modern web. 
    Unlike standard grammar checkers, Metaphrase utilizes advanced AI technology to understand the deep context of your writing. It doesn't just swap words; it rebuilds sentences from the ground up to perfectly match your desired tone while keeping the meaning 100% intact.
    </p>
    <hr style='border-color: rgba(12, 74, 110, 0.2); margin: 20px 0;'>
    <ul style='font-size: 1.1rem; line-height: 1.8; list-style-type: none; padding-left: 0; color: #0c4a6e;'>
        <li>✨ <b>Core AI:</b> Gemini 3 Series Flash Engine</li>
        <li>🚀 <b>Framework:</b> Streamlit & Python</li>
        <li>🎨 <b>Theme:</b> Sky Blue & White Neo-Brutalism</li>
        <li>📊 <b>Metrics:</b> Flesch Reading Ease & Grade Level Estimation</li>
    </ul>
</div>
        """, unsafe_allow_html=True)

    st.markdown("""
<div style='display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 30px;'>
    <div style='flex-shrink: 0;'>
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" style="width: 140px; height: 140px; border-radius: 50%; border: 3px solid #0ea5e9; box-shadow: 4px 4px 0px #0c4a6e; object-fit: cover;">
    </div>
    <div style='background: rgba(255,255,255,0.9); padding: 20px 25px; border-radius: 15px; border: 2px solid #0c4a6e; box-shadow: 4px 4px 0px #0c4a6e; flex-grow: 1;'>
        <h3 style='color: #0c4a6e; margin-top: 0; margin-bottom: 12px; font-weight: 800;'>Contact & Team Details</h3>
        <p style='margin: 8px 0; font-size: 1.1rem; color: #334155;'>👨‍💻 <b>Developer:</b> Nilesh</p>
        <p style='margin: 8px 0; font-size: 1.1rem; color: #334155;'>📞 <b>Phone:</b> +91 9014667048</p>
        <p style='margin: 8px 0; font-size: 1.1rem; color: #334155;'>✉️ <b>Gmail:</b> nileshhake@gmail.com</p>
        <hr style='border-color: rgba(12, 74, 110, 0.2); margin: 15px 0;'>
        <p style='margin: 8px 0; font-size: 1rem; color: #64748b; line-height: 1.5;'>
        <b>About the Developer:</b> Nilesh is a passionate computer science enthusiast specializing in Python, Machine Learning (Deep Learning, CNNs), and Cloud Computing (AWS). He enjoys building practical AI tools, working on computer vision projects, and solving complex algorithmic challenges.
        </p>
    </div>
</div>
    """, unsafe_allow_html=True)

    st.markdown("<br><br>", unsafe_allow_html=True)

    st.markdown("""
<div style="background-color: #232F3E; padding: 40px 20px; border-radius: 15px; color: white; font-family: 'Inter', sans-serif;">
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        <div style="margin-bottom: 20px;">
            <h4 style="color: white; font-weight: 700; margin-bottom: 15px; font-size: 16px;">Get to Know Us</h4>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">About Metaphrase</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Careers</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Press Releases</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Metaphrase Science</p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4 style="color: white; font-weight: 700; margin-bottom: 15px; font-size: 16px;">Connect with Us</h4>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Facebook</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Twitter</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Instagram</p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4 style="color: white; font-weight: 700; margin-bottom: 15px; font-size: 16px;">Make Money with Us</h4>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Sell on Metaphrase</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Metaphrase Accelerator</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Protect and Build Your Brand</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Global Selling</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Become an Affiliate</p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4 style="color: white; font-weight: 700; margin-bottom: 15px; font-size: 16px;">Let Us Help You</h4>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Your Account</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Returns Centre</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">100% Purchase Protection</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Metaphrase App Download</p>
            <p style="margin: 8px 0; font-size: 14px; color: #DDDDDD; cursor: pointer;">Help</p>
        </div>
    </div>
    <hr style="border-color: #3A4553; margin: 30px 0;">
    <div style="text-align: center; display: flex; justify-content: center; align-items: center; gap: 20px;">
        <h3 style="color: white; margin: 0; font-family: 'Outfit', sans-serif;">metaphrase</h3>
        <div style="border: 1px solid #888; padding: 6px 12px; border-radius: 4px; font-size: 13px; color: #CCC; cursor: pointer;">🌐 English</div>
        <div style="border: 1px solid #888; padding: 6px 12px; border-radius: 4px; font-size: 13px; color: #CCC; cursor: pointer;">🇮🇳 India</div>
    </div>
</div>
    """, unsafe_allow_html=True)

# Main Routing...
if not st.session_state.logged_in: login_page()
elif st.session_state.user_role == 'admin': admin_dashboard()
else: main_app()