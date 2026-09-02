import streamlit as st
import os
import io
import time
import difflib
import pandas as pd
from docx import Document

from database import (
    init_db, verify_login, register_user, get_all_users,
    update_status, add_history, get_user_history, clear_user_history
)
from utils.ai_generator import generate_paraphrase, TONE_PROFILES
from utils.text_metrics import get_detailed_metrics, calculate_reading_time

# --- Page Configuration ---
st.set_page_config(
    page_title="Metaphrase AI — Intelligent Text Transformation",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Initialize Database on startup ---
init_db()

# --- Fast CSS Injection (Zero Latency) ---
def inject_custom_css():
    css_candidates = ["assets/style.css", "assests/style.css"]
    css_content = ""
    for path in css_candidates:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                css_content = f.read()
            break
    if css_content:
        st.markdown(f"<style>{css_content}</style>", unsafe_allow_html=True)

inject_custom_css()

# --- Session State Initialization ---
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
if 'user_email' not in st.session_state:
    st.session_state.user_email = ""
if 'user_name' not in st.session_state:
    st.session_state.user_name = ""
if 'user_role' not in st.session_state:
    st.session_state.user_role = ""
if 'diff' not in st.session_state:
    st.session_state.diff = 'Simple'
if 'input_text' not in st.session_state:
    st.session_state.input_text = ""
if 'output_text' not in st.session_state:
    st.session_state.output_text = ""
if 'show_diff' not in st.session_state:
    st.session_state.show_diff = False
if 'show_export' not in st.session_state:
    st.session_state.show_export = False
if 'show_metrics' not in st.session_state:
    st.session_state.show_metrics = True

SAMPLE_TEXTS = {
    "Academic": "Quantum computing harnesses the phenomena of superposition and quantum entanglement to perform computations far exceeding classical computational capabilities.",
    "Business": "We must optimize our cross-functional operational synergies and leverage agile methodologies to ensure maximum quarterly profitability and stakeholder satisfaction.",
    "Technical": "The microservices architecture employs asynchronous event-driven message queuing to decouple monolithic dependencies and minimize end-to-end request latency."
}

def create_docx_file(original: str, paraphrased: str, tone: str) -> io.BytesIO:
    doc = Document()
    doc.add_heading("Metaphrase AI — Transformation Report", level=0)
    doc.add_paragraph(f"Tone / Level: {tone}")
    doc.add_heading("Original Text", level=1)
    doc.add_paragraph(original)
    doc.add_heading("Paraphrased Text", level=1)
    doc.add_paragraph(paraphrased)
    
    bio = io.BytesIO()
    doc.save(bio)
    bio.seek(0)
    return bio

def render_diff_html(original: str, paraphrased: str) -> str:
    orig_words = original.split()
    para_words = paraphrased.split()
    matcher = difflib.SequenceMatcher(None, orig_words, para_words)
    html_parts = []
    
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == 'equal':
            html_parts.append(" ".join(orig_words[i1:i2]))
        elif tag == 'replace':
            html_parts.append(f"<span class='diff-tag-removed'>{' '.join(orig_words[i1:i2])}</span> <span class='diff-tag-added'>{' '.join(para_words[j1:j2])}</span>")
        elif tag == 'delete':
            html_parts.append(f"<span class='diff-tag-removed'>{' '.join(orig_words[i1:i2])}</span>")
        elif tag == 'insert':
            html_parts.append(f"<span class='diff-tag-added'>{' '.join(para_words[j1:j2])}</span>")
            
    return " ".join(html_parts)

# ==============================================================================
# 1. AUTHENTICATION (LOGIN & REGISTRATION)
# ==============================================================================
def login_page():
    st.markdown("""
        <div style='text-align: center; margin-top: 20px; margin-bottom: 25px;'>
            <div style='display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.85); padding: 8px 20px; border-radius: 9999px; border: 1px solid rgba(226,232,240,0.9); box-shadow: 0 4px 12px rgba(15,23,42,0.04); margin-bottom: 12px;'>
                <span style='font-size: 1.2rem;'>✨</span>
                <span style='font-size: 0.9rem; font-weight: 700; color: #0284c7; letter-spacing: 0.05em; text-transform: uppercase;'>Metaphrase AI 3.0 • Next-Gen Language Engine</span>
            </div>
            <h1 style='font-size: 2.8rem; margin: 0; background: linear-gradient(135deg, #0f172a 0%, #0284c7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>Precision Rewriting. Elevated Clarity.</h1>
            <p style='font-size: 1.15rem; color: #64748b; margin-top: 8px;'>Transform complex prose into clear, fluent, or high-impact text in milliseconds.</p>
        </div>
    """, unsafe_allow_html=True)

    col_space1, col_center, col_space2 = st.columns([1, 1.8, 1])
    
    with col_center:
        st.markdown("<div class='floating-card'>", unsafe_allow_html=True)
        tab_login, tab_register = st.tabs(["🔐 Sign In", "📝 Create Account"])
        
        with tab_login:
            st.markdown("<h3 style='margin-top: 10px; font-size: 1.3rem;'>Welcome Back</h3>", unsafe_allow_html=True)
            st.markdown("<p style='color: #64748b; font-size: 0.9rem;'>Enter your credentials to access your AI workspace.</p>", unsafe_allow_html=True)
            
            login_email = st.text_input("Email Address", key="log_email", placeholder="name@company.com")
            login_pass = st.text_input("Password", type="password", key="log_pass", placeholder="••••••••")
            
            st.markdown("<div style='height: 12px;'></div>", unsafe_allow_html=True)
            if st.button("Sign In to Metaphrase →", type="primary", use_container_width=True):
                if not login_email or not login_pass:
                    st.warning("⚠️ Please fill in all fields.")
                else:
                    user_data = verify_login(login_email, login_pass)
                    if user_data:
                        role, status, name = user_data
                        if status == 'pending':
                            st.warning("⏳ Your account is pending administrator approval. Please check back shortly.")
                        elif status == 'rejected':
                            st.error("🚫 Access denied. Please contact support.")
                        elif status == 'accepted':
                            st.session_state.logged_in = True
                            st.session_state.user_email = login_email
                            st.session_state.user_name = name
                            st.session_state.user_role = role
                            st.rerun()
                    else:
                        st.error("❌ Invalid email or password.")
                        
        with tab_register:
            st.markdown("<h3 style='margin-top: 10px; font-size: 1.3rem;'>Get Started</h3>", unsafe_allow_html=True)
            st.markdown("<p style='color: #64748b; font-size: 0.9rem;'>Create your personal account for instant AI paraphrasing.</p>", unsafe_allow_html=True)
            
            reg_name = st.text_input("Full Name", key="reg_name", placeholder="Dr. Jane Doe")
            reg_email = st.text_input("Email Address", key="reg_email", placeholder="jane@example.com")
            reg_pass = st.text_input("Password", type="password", key="reg_pass", placeholder="Min. 6 characters")
            reg_pass_conf = st.text_input("Confirm Password", type="password", key="reg_conf", placeholder="Repeat password")
            
            st.markdown("<div style='height: 12px;'></div>", unsafe_allow_html=True)
            if st.button("Register Account", type="primary", use_container_width=True):
                if not reg_name or not reg_email or not reg_pass:
                    st.warning("⚠️ Please fill in all required fields.")
                elif reg_pass != reg_pass_conf:
                    st.error("❌ Passwords do not match!")
                elif len(reg_pass) < 6:
                    st.warning("⚠️ Password must be at least 6 characters.")
                else:
                    if register_user(reg_name, reg_email, reg_pass):
                        st.success("✅ Account registered! Once an admin approves your request, you can log in.")
                    else:
                        st.error("⚠️ This email address is already registered.")
                        
        st.markdown("</div>", unsafe_allow_html=True)

# ==============================================================================
# 2. MAIN APPLICATION WORKSPACE
# ==============================================================================
def main_app():
    with st.sidebar:
        st.markdown("""
            <div style='text-align: center; padding: 10px 0 16px 0;'>
                <div style='font-size: 2.2rem; margin-bottom: 4px;' class='floating-anim'>✨</div>
                <h2 style='margin: 0; font-size: 1.5rem; color: #0284c7;'>Metaphrase AI</h2>
                <span style='font-size: 0.8rem; color: #64748b; font-weight: 600;'>PRO EDITION</span>
            </div>
        """, unsafe_allow_html=True)
        
        page = st.radio(
            "Navigation", 
            ["✨ Paraphrase Tool", "📊 History & Analytics", "ℹ️ About & Docs"],
            label_visibility="collapsed"
        )
        
        st.markdown("---")
        
        # User Info Pill
        st.markdown(f"""
            <div style='background: rgba(255,255,255,0.8); border: 1px solid rgba(226,232,240,0.9); border-radius: 12px; padding: 12px 14px; margin-bottom: 15px;'>
                <div style='font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700;'>Logged in as</div>
                <div style='font-weight: 700; color: #0f172a; font-size: 0.95rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;'>{st.session_state.user_email}</div>
                <div style='font-size: 0.8rem; color: #0284c7; font-weight: 600; margin-top: 2px;'>● Online (Gemini 3.5 Flash)</div>
            </div>
        """, unsafe_allow_html=True)
        
        if st.button("🚪 Logout", use_container_width=True):
            st.session_state.logged_in = False
            st.session_state.user_email = ""
            st.session_state.user_role = ""
            st.rerun()

    if page == "✨ Paraphrase Tool":
        render_paraphrase_tool()
    elif page == "📊 History & Analytics":
        render_history()
    elif page == "ℹ️ About & Docs":
        render_about()

# ==============================================================================
# PARAPHRASE TOOL & FLOATING CONTROLS
# ==============================================================================
def render_paraphrase_tool():
    # Header
    st.markdown("""
        <div style='display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 15px;'>
            <div>
                <h1 style='margin: 0; font-size: 2.2rem;'>Intelligent Text Paraphraser</h1>
                <p style='margin: 4px 0 0 0; color: #64748b; font-size: 1rem;'>Select your preferred tone and instantly rewrite with zero latency.</p>
            </div>
        </div>
    """, unsafe_allow_html=True)

    # Tone & Difficulty Selector Cards
    st.markdown("<div style='font-weight: 700; font-size: 0.95rem; color: #334155; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;'>1. Select Tone & Style</div>", unsafe_allow_html=True)
    
    cols = st.columns(len(TONE_PROFILES))
    for i, (key, profile) in enumerate(TONE_PROFILES.items()):
        with cols[i]:
            is_active = (st.session_state.diff == key)
            active_cls = "active" if is_active else ""
            st.markdown(f"""
                <div class="diff-card {active_cls}">
                    <div class="icon">{profile['icon']}</div>
                    <div class="title">{key}</div>
                    <div class="desc">{profile['description']}</div>
                </div>
            """, unsafe_allow_html=True)
            if st.button(f"Use {key}", key=f"btn_tone_{key}", use_container_width=True):
                st.session_state.diff = key
                st.rerun()

    # Floating Action Dock (Live Stats & Quick Tools)
    input_val = st.session_state.input_text
    output_val = st.session_state.output_text
    
    in_words = len(input_val.split()) if input_val else 0
    in_chars = len(input_val) if input_val else 0
    out_words = len(output_val.split()) if output_val else 0
    read_time = calculate_reading_time(input_val) if input_val else "0s"

    st.markdown(f"""
        <div class="floating-dock">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <span class="stat-pill">📝 Input: <span class="val">{in_words}</span> words</span>
                <span class="stat-pill">🔤 Chars: <span class="val">{in_chars}</span></span>
                <span class="stat-pill">⏱️ Read Time: <span class="val">{read_time}</span></span>
                <span class="stat-pill">🎯 Active Tone: <span class="val">{st.session_state.diff}</span></span>
            </div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #0284c7;">⚡ High-Speed Engine Ready</div>
        </div>
    """, unsafe_allow_html=True)

    # Text Area Editors
    col_left, col_right = st.columns(2)
    BOX_HEIGHT = 380

    with col_left:
        st.markdown("<div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;'><span style='font-family: Outfit; font-weight: 700; font-size: 1.1rem; color: #0f172a;'>📥 Original Text</span></div>", unsafe_allow_html=True)
        
        # Sample loader buttons
        sample_cols = st.columns([1, 1, 1, 1])
        if sample_cols[0].button("📄 Sample: Tech", use_container_width=True):
            st.session_state.input_text = SAMPLE_TEXTS["Technical"]
            st.rerun()
        if sample_cols[1].button("💼 Sample: Biz", use_container_width=True):
            st.session_state.input_text = SAMPLE_TEXTS["Business"]
            st.rerun()
        if sample_cols[2].button("🎓 Sample: Acad", use_container_width=True):
            st.session_state.input_text = SAMPLE_TEXTS["Academic"]
            st.rerun()
        if sample_cols[3].button("🗑️ Clear All", use_container_width=True):
            st.session_state.input_text = ""
            st.session_state.output_text = ""
            st.rerun()

        input_text = st.text_area(
            "Original Text Area",
            value=st.session_state.input_text,
            placeholder="Type or paste your text here to transform...",
            height=BOX_HEIGHT,
            label_visibility="collapsed",
            key="input_area"
        )
        st.session_state.input_text = input_text

    with col_right:
        st.markdown("<div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;'><span style='font-family: Outfit; font-weight: 700; font-size: 1.1rem; color: #0284c7;'>✨ Paraphrased Output</span></div>", unsafe_allow_html=True)
        
        # Output tool buttons
        out_tool_cols = st.columns([1, 1, 1])
        toggle_diff = out_tool_cols[0].button("🔍 Toggle Diff View", use_container_width=True)
        if toggle_diff:
            st.session_state.show_diff = not st.session_state.show_diff
            st.rerun()
            
        toggle_metrics = out_tool_cols[1].button("📊 Toggle Metrics", use_container_width=True)
        if toggle_metrics:
            st.session_state.show_metrics = not st.session_state.show_metrics
            st.rerun()

        toggle_export = out_tool_cols[2].button("💾 Export Center", use_container_width=True)
        if toggle_export:
            st.session_state.show_export = not st.session_state.show_export
            st.rerun()

        st.text_area(
            "Paraphrased Text Area",
            value=st.session_state.output_text,
            placeholder="Transformed text will appear here instantly...",
            height=BOX_HEIGHT,
            label_visibility="collapsed",
            disabled=True,
            key="output_area"
        )

    # Primary Action Trigger
    st.markdown("<div style='height: 15px;'></div>", unsafe_allow_html=True)
    _, btn_center, _ = st.columns([1, 1.4, 1])
    
    with btn_center:
        if st.button("🚀 Paraphrase & Elevate Text", type="primary", use_container_width=True):
            if not input_text or not input_text.strip():
                st.warning("⚠️ Please enter some text to paraphrase.")
            else:
                with st.spinner(f"Transforming with {st.session_state.diff} tone..."):
                    t_start = time.time()
                    result = generate_paraphrase(input_text, st.session_state.diff)
                    t_elapsed = round(time.time() - t_start, 2)
                    
                    if result == "SERVICE_ERROR":
                        st.error("❌ AI service temporarily busy. Please try again.")
                    else:
                        st.session_state.output_text = result
                        add_history(st.session_state.user_email, input_text, result, st.session_state.diff)
                        st.toast(f"✅ Transformed in {t_elapsed}s!", icon="⚡")
                        st.rerun()

    # ==========================================================================
    # FLOATING MODAL WINDOWS & EXPANDABLE PANELS
    # ==========================================================================

    # 1. Floating Diff Inspector Window
    if st.session_state.show_diff and input_text and output_val:
        st.markdown("<div style='height: 25px;'></div>", unsafe_allow_html=True)
        st.markdown("""
            <div class='floating-window'>
                <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;'>
                    <h3 style='margin: 0; font-size: 1.3rem; color: #0f172a;'>🔍 Side-by-Side Diff Inspector</h3>
                    <span style='font-size: 0.8rem; background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 9999px; font-weight: 700;'>Live Word Comparison</span>
                </div>
                <p style='color: #64748b; font-size: 0.9rem; margin-bottom: 14px;'>Green tags show new enriched words; Red struck-through tags indicate original terms replaced.</p>
        """, unsafe_allow_html=True)
        
        diff_html = render_diff_html(input_text, output_val)
        st.markdown(f"<div class='diff-view-box'>{diff_html}</div></div>", unsafe_allow_html=True)

    # 2. Floating Export Center Window
    if st.session_state.show_export and output_val:
        st.markdown("<div style='height: 25px;'></div>", unsafe_allow_html=True)
        st.markdown("""
            <div class='floating-window'>
                <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;'>
                    <h3 style='margin: 0; font-size: 1.3rem; color: #0f172a;'>💾 Export & Download Center</h3>
                    <span style='font-size: 0.8rem; background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 9999px; font-weight: 700;'>1-Click Exporter</span>
                </div>
                <p style='color: #64748b; font-size: 0.9rem;'>Download your transformed text in your preferred professional document format.</p>
        """, unsafe_allow_html=True)
        
        exp_col1, exp_col2, exp_col3 = st.columns(3)
        
        # Word DOCX
        docx_bytes = create_docx_file(input_text, output_val, st.session_state.diff)
        exp_col1.download_button(
            label="📄 Download as Word (.docx)",
            data=docx_bytes,
            file_name="Metaphrase_AI_Transformation.docx",
            mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            use_container_width=True
        )
        
        # Plain Text
        exp_col2.download_button(
            label="📝 Download as Text (.txt)",
            data=output_val,
            file_name="Metaphrase_Output.txt",
            mime="text/plain",
            use_container_width=True
        )
        
        # Markdown
        md_content = f"# Metaphrase AI Output\n\n**Tone:** {st.session_state.diff}\n\n## Paraphrased Content\n\n{output_val}\n\n---\n*Original Text:*\n\n{input_text}\n"
        exp_col3.download_button(
            label="📑 Download as Markdown (.md)",
            data=md_content,
            file_name="Metaphrase_Report.md",
            mime="text/markdown",
            use_container_width=True
        )
        
        st.markdown("</div>", unsafe_allow_html=True)

    # 3. Floating Readability & Linguistic Analytics Window
    if st.session_state.show_metrics and input_text and output_val:
        st.markdown("<div style='height: 25px;'></div>", unsafe_allow_html=True)
        metrics = get_detailed_metrics(input_text, output_val)
        summary = metrics.get("summary", {})
        
        st.markdown("""
            <div class='floating-window'>
                <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;'>
                    <h3 style='margin: 0; font-size: 1.3rem; color: #0f172a;'>📊 Readability & Linguistic Comparison</h3>
                    <span style='font-size: 0.8rem; background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 9999px; font-weight: 700;'>Linguistic Insights</span>
                </div>
        """, unsafe_allow_html=True)
        
        if summary:
            # Summary Metric Grid
            st.markdown(f"""
                <div class="metric-grid">
                    <div class="metric-box">
                        <div class="metric-label">Reading Ease</div>
                        <div class="metric-value">{summary.get('ease_para', 0)}</div>
                        <div class="metric-badge badge-positive">{summary.get('ease_delta', '+0')}</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Word Count</div>
                        <div class="metric-value">{summary.get('word_count_para', 0)}</div>
                        <div class="metric-badge badge-neutral">{summary.get('word_delta', '0 words')}</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Reading Time</div>
                        <div class="metric-value">{summary.get('read_time_para', '0s')}</div>
                        <div class="metric-badge badge-neutral">Optimal</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Vocabulary Diversity</div>
                        <div class="metric-value">{summary.get('diversity_para', '0%')}</div>
                        <div class="metric-badge badge-positive">Enriched</div>
                    </div>
                </div>
            """, unsafe_allow_html=True)

        # Full breakdown table
        table_rows = metrics.get("table_data", [])
        if table_rows:
            df_metrics = pd.DataFrame(table_rows)
            st.dataframe(df_metrics, use_container_width=True, hide_index=True)

        st.markdown("</div>", unsafe_allow_html=True)

# ==============================================================================
# 3. HISTORY & ANALYTICS PAGE
# ==============================================================================
def render_history():
    st.markdown("""
        <div style='margin-bottom: 20px;'>
            <h1 style='margin: 0; font-size: 2.2rem;'>📊 History & Usage Analytics</h1>
            <p style='color: #64748b; font-size: 1rem;'>Review your past transformations, track vocabulary trends, and restore previous results.</p>
        </div>
    """, unsafe_allow_html=True)

    records = get_user_history(st.session_state.user_email)
    
    if not records:
        st.markdown("""
            <div class='floating-card' style='text-align: center; padding: 40px;'>
                <div style='font-size: 3rem;'>📖</div>
                <h3>No History Recorded Yet</h3>
                <p style='color: #64748b;'>Start transforming text in the Paraphrase Tool to build your personal library.</p>
            </div>
        """, unsafe_allow_html=True)
        return
        
    df = pd.DataFrame(records, columns=['ID', 'Original Text', 'Paraphrased Text', 'Difficulty', 'Date'])
    df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d %H:%M')
    
    # Analytics Grid
    st.markdown("<div class='floating-card' style='margin-bottom: 24px;'>", unsafe_allow_html=True)
    st.markdown("<h3 style='margin-top: 0; font-size: 1.2rem;'>Overview Statistics</h3>", unsafe_allow_html=True)
    
    diff_counts = df['Difficulty'].value_counts()
    most_used = diff_counts.idxmax() if not diff_counts.empty else "N/A"
    
    stat_c1, stat_c2, stat_c3 = st.columns(3)
    stat_c1.metric("Total Generations", f"{len(df):,}")
    stat_c2.metric("Most Used Tone Style", str(most_used))
    stat_c3.metric("Database Latency", "< 2 ms (WAL Mode)")
    
    st.markdown("<h4 style='margin-top: 15px; font-size: 1rem; color: #64748b;'>Tone Distribution</h4>", unsafe_allow_html=True)
    st.bar_chart(diff_counts, color="#0284c7")
    st.markdown("</div>", unsafe_allow_html=True)
    
    # History Table & Controls
    st.markdown("<div class='floating-card'>", unsafe_allow_html=True)
    col_t_title, col_t_btn = st.columns([4, 1])
    with col_t_title:
        st.markdown("<h3 style='margin: 0;'>Past Transformations</h3>", unsafe_allow_html=True)
    with col_t_btn:
        if st.button("🗑️ Clear My History", use_container_width=True):
            clear_user_history(st.session_state.user_email)
            st.success("History cleared!")
            st.rerun()

    # Search filter
    search_q = st.text_input("Search past records...", placeholder="Filter by keyword...", label_visibility="collapsed")
    if search_q:
        filtered_df = df[df['Original Text'].str.contains(search_q, case=False, na=False) | df['Paraphrased Text'].str.contains(search_q, case=False, na=False)]
    else:
        filtered_df = df

    st.dataframe(
        filtered_df[['Date', 'Difficulty', 'Original Text', 'Paraphrased Text']], 
        use_container_width=True, 
        hide_index=True
    )
    st.markdown("</div>", unsafe_allow_html=True)

# ==============================================================================
# 4. ADMIN DASHBOARD
# ==============================================================================
def admin_dashboard():
    with st.container():
        st.markdown("""
            <div class='floating-card' style='margin-bottom: 24px;'>
                <div style='display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;'>
                    <div>
                        <h1 style='margin: 0; font-size: 2.2rem;'>🛡️ Administrator Console</h1>
                        <p style='color: #64748b; margin-top: 4px;'>Manage user registrations, permissions, and platform access.</p>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<div class='floating-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='margin-top: 0;'>Registered User Accounts</h3>", unsafe_allow_html=True)
    
    users = get_all_users()
    if not users:
        st.info("No registered users found.")
    else:
        for user in users:
            name, email, role, status = user
            status_color = "#15803d" if status == "accepted" else ("#b91c1c" if status == "rejected" else "#b45309")
            status_bg = "#dcfce7" if status == "accepted" else ("#fee2e2" if status == "rejected" else "#fef3c7")
            
            st.markdown(f"""
                <div style='background: rgba(255,255,255,0.9); padding: 16px 20px; border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(226,232,240,0.9); box-shadow: 0 4px 12px rgba(15,23,42,0.03); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;'>
                    <div>
                        <div style='font-size: 1.1rem; font-weight: 700; color: #0f172a;'>👤 {name}</div>
                        <div style='color: #64748b; font-size: 0.9rem;'>📧 {email} &nbsp;•&nbsp; Role: <b>{role.upper()}</b></div>
                    </div>
                    <div style='display: flex; align-items: center; gap: 12px; margin-top: 8px;'>
                        <span style='background: {status_bg}; color: {status_color}; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 0.8rem;'>{status.upper()}</span>
                    </div>
                </div>
            """, unsafe_allow_html=True)
            
            # Action buttons
            btn_col1, btn_col2, _ = st.columns([1, 1, 4])
            if status != "accepted":
                if btn_col1.button("✅ Approve", key=f"acc_{email}", type="primary", use_container_width=True):
                    update_status(email, 'accepted')
                    st.toast(f"Approved {email}", icon="✅")
                    st.rerun()
            if status != "rejected":
                if btn_col2.button("🚫 Revoke / Reject", key=f"rej_{email}", use_container_width=True):
                    update_status(email, 'rejected')
                    st.toast(f"Updated {email}", icon="🚫")
                    st.rerun()

    st.markdown("</div>", unsafe_allow_html=True)
    
    st.markdown("<div style='height: 20px;'></div>", unsafe_allow_html=True)
    if st.button("🚪 Logout Admin", type="secondary"):
        st.session_state.logged_in = False
        st.session_state.user_role = ""
        st.rerun()

# ==============================================================================
# 5. ABOUT & DOCUMENTATION PAGE
# ==============================================================================
def render_about():
    st.markdown("""
        <div style='margin-bottom: 25px;'>
            <h1 style='margin: 0; font-size: 2.2rem;'>ℹ️ About Metaphrase AI</h1>
            <p style='color: #64748b; font-size: 1rem;'>Deep-context AI rewriting engine powered by Gemini Flash models.</p>
        </div>
    """, unsafe_allow_html=True)
    
    col_left, col_right = st.columns([1.6, 1])
    
    with col_left:
        st.markdown("""
            <div class='floating-card' style='margin-bottom: 20px;'>
                <h2 style='color: #0284c7; margin-top: 0;'>Next-Generation AI Text Transformation</h2>
                <p style='font-size: 1.05rem; line-height: 1.7; color: #334155;'>
                    <b>Metaphrase AI</b> goes far beyond basic synonyms or word-substitution algorithms. 
                    Leveraging advanced neural attention mechanisms, it reconstructs paragraphs from first principles to optimize for clarity, executive conciseness, or academic sophistication while preserving 100% semantic fidelity.
                </p>
                <hr style='border-color: rgba(226,232,240,0.8); margin: 20px 0;'>
                <h4 style='margin-top: 0; color: #0f172a;'>Architecture Highlights</h4>
                <ul style='font-size: 1rem; line-height: 1.9; color: #334155; padding-left: 20px;'>
                    <li>⚡ <b>Multi-Tier AI Engine:</b> Gemini 3.5 Flash & 3.6 Flash with automatic fallback and in-memory LRU caching.</li>
                    <li>🎨 <b>Floating Glassmorphism UI:</b> Hardware-accelerated CSS3 animations with zero external network overhead.</li>
                    <li>📊 <b>Readability Suite:</b> Real-time Flesch Reading Ease, Flesch-Kincaid Grade, and Gunning Fog index.</li>
                    <li>💾 <b>Document Export:</b> One-click Word (.docx), Markdown, and Plain Text downloaders.</li>
                    <li>🚀 <b>High-Throughput Database:</b> SQLite with Write-Ahead Logging (WAL) and index optimization.</li>
                </ul>
            </div>
        """, unsafe_allow_html=True)
        
    with col_right:
        st.markdown("""
            <div class='floating-card'>
                <h3 style='color: #0f172a; margin-top: 0; font-weight: 800;'>👨‍💻 Lead Developer</h3>
                <div style='display: flex; align-items: center; gap: 14px; margin-bottom: 15px;'>
                    <div style='width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #0284c7); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; box-shadow: 0 4px 14px rgba(2,132,199,0.4);'>N</div>
                    <div>
                        <div style='font-size: 1.2rem; font-weight: 800; color: #0f172a;'>Nilesh Hake</div>
                        <div style='font-size: 0.85rem; color: #64748b;'>AI Engineer & Full-Stack Developer</div>
                    </div>
                </div>
                <hr style='border-color: rgba(226,232,240,0.8); margin: 15px 0;'>
                <p style='margin: 8px 0; font-size: 0.95rem; color: #334155;'>📞 <b>Phone:</b> +91 9014667048</p>
                <p style='margin: 8px 0; font-size: 0.95rem; color: #334155;'>✉️ <b>Email:</b> nileshhake@gmail.com</p>
                <p style='margin: 8px 0; font-size: 0.95rem; color: #334155;'>🌐 <b>Specialization:</b> Python, Deep Learning, Cloud Architecture</p>
            </div>
        """, unsafe_allow_html=True)

# ==============================================================================
# MAIN ROUTER
# ==============================================================================
if not st.session_state.logged_in:
    login_page()
elif st.session_state.user_role == 'admin':
    admin_dashboard()
else:
    main_app()