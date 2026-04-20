import streamlit as st

def style_base_home():

    st.markdown("""
        <style>
                .stApp {
                    background-color: #10f2f6;
                    color: #553333;}
        </style>
         """, unsafe_allow_html=True)
    
def style_base_dashboard():

    st.markdown("""
        <style>
                .stApp {
                    background-color: #00f2f6;
                    color: #883333;}
        </style>
         """, unsafe_allow_html=True)
    
def style_base_layout():

    st.markdown("""
        <style>
                @import url('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Sekuya&display=swap');

                /* hide top tool bar */
                #MainMenu, footer ,header {visibility: hidden;}
                
                .block-container {
                    padding-top: 2rem;
                    padding-bottom: 2rem;
                    padding-left: 2rem;
                    padding-right: 2rem;
                }
                h1 , h2 {
                    font-family: 'Sekuya', sans-serif !important;
                    font-size: 2.5rem !important;
                    line-height: 1.2 !important;
                    margin-bottom: 1rem !important;
                    }
                
                h3, h4, h5, h6 {
                    font-family: 'Jersey 10', sans-serif !important;
                    line-height: 1.2 !important;
                    margin-bottom: 1rem !important;
                    }
                
                .stApp {
                    background-color: #64ed9b;
                    color:#0016a8;}
        </style>
         """, unsafe_allow_html=True)