package com.admitra.service;

import com.admitra.dto.CampaignCreateRequest;
import com.admitra.dto.CampaignDto;
import com.admitra.entity.Campaign;
import com.admitra.entity.CampaignStatus;
import com.admitra.entity.User;
import com.admitra.exception.ResourceNotFoundException;
import com.admitra.repository.CampaignRepository;
import com.admitra.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    public CampaignService(CampaignRepository campaignRepository, UserRepository userRepository) {
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
    }

    public List<CampaignDto> getCampaignsByUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return campaignRepository.findByCreatedBy(user).stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    public List<CampaignDto> getAllCampaigns() {
        return campaignRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public CampaignDto createCampaign(CampaignCreateRequest request, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Campaign campaign = new Campaign();
        campaign.setName(request.getName());
        campaign.setBudget(request.getBudget());
        campaign.setPlatform(request.getPlatform());
        campaign.setTargetAudience(request.getTargetAudience());
        campaign.setCategory(request.getCategory());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setStatus(CampaignStatus.DRAFT);
        campaign.setCreatedBy(user);
        
        return mapToDto(campaignRepository.save(campaign));
    }

    public CampaignDto updateCampaign(Long id, CampaignCreateRequest request) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        campaign.setName(request.getName());
        campaign.setBudget(request.getBudget());
        campaign.setPlatform(request.getPlatform());
        campaign.setTargetAudience(request.getTargetAudience());
        campaign.setCategory(request.getCategory());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        return mapToDto(campaignRepository.save(campaign));
    }

    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }

    public CampaignDto pauseCampaign(Long id) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        campaign.setStatus(CampaignStatus.PAUSED);
        return mapToDto(campaignRepository.save(campaign));
    }

    public CampaignDto resumeCampaign(Long id) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        campaign.setStatus(CampaignStatus.RUNNING);
        return mapToDto(campaignRepository.save(campaign));
    }

    private CampaignDto mapToDto(Campaign campaign) {
        CampaignDto dto = new CampaignDto();
        dto.setId(campaign.getId());
        dto.setName(campaign.getName());
        dto.setBudget(campaign.getBudget());
        dto.setStatus(campaign.getStatus());
        dto.setPlatform(campaign.getPlatform());
        dto.setTargetAudience(campaign.getTargetAudience());
        dto.setCategory(campaign.getCategory());
        dto.setStartDate(campaign.getStartDate());
        dto.setEndDate(campaign.getEndDate());
        return dto;
    }
}
