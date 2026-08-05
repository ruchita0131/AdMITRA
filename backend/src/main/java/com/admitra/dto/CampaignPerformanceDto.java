package com.admitra.dto;

import java.math.BigDecimal;

public class CampaignPerformanceDto {
    private Long campaignId;
    private String campaignName;
    private BigDecimal ctr;
    private BigDecimal spend;

    public CampaignPerformanceDto(Long campaignId, String campaignName, BigDecimal ctr, BigDecimal spend) {
        this.campaignId = campaignId;
        this.campaignName = campaignName;
        this.ctr = ctr;
        this.spend = spend;
    }

    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }
    public String getCampaignName() { return campaignName; }
    public void setCampaignName(String campaignName) { this.campaignName = campaignName; }
    public BigDecimal getCtr() { return ctr; }
    public void setCtr(BigDecimal ctr) { this.ctr = ctr; }
    public BigDecimal getSpend() { return spend; }
    public void setSpend(BigDecimal spend) { this.spend = spend; }
}
