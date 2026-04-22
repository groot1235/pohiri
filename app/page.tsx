import React from 'react'
import { Header } from '../components/hero-section/navbar/header'
import { HeroSection } from '@/components/hero-section/hero/hero'
import { FeatureSection } from '@/components/hero-section/features/features'
import { FaqsSection } from "@/components/hero-section/faq/faqs-section";
type Props = {}

const page = (props: Props) => {
    return (
        <div className='gap-15'>
            <Header />
            <HeroSection />
            <div className='p-9'>
                <FeatureSection />
            </div>
            <div className='p-20'>
                <FaqsSection />
            </div>
        </div>
    )
}

export default page