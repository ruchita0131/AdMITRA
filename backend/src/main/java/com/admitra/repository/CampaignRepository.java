package com.admitra.repository;

import com.admitra.entity.Campaign;
import com.admitra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByCreatedBy(User user);
}
